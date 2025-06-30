import backtrader as bt
from app.constants.min_order_size import MIN_ORDER_SIZE
from app.services.custom_sizer import CustomSizer
from datetime import date, datetime, time
import pytz
import backtrader.analyzers as btanalyzers


class JSONStrategy(bt.Strategy):
    """
    A JSON-configurable backtrader strategy that filters trades
    based on buy/sell conditions, candle patterns, and a start date.
    """
    def __init__(self, buy_conditions, sell_conditions, startdate: date):
        # Parsed condition tuples
        self.buy_conditions = self._parse_conditions(buy_conditions)
        self.sell_conditions = self._parse_conditions(sell_conditions)

        # Convert start date to datetime at midnight
        self.start_dt = datetime.combine(startdate, time.min)

        # Trade tracking
        self.order_count = 0
        self.trades = []
        self.total_commission = 0.0
        self.open_trade = None

        self.macd_hist = None

        self.open_trade = None

    def _parse_conditions(self, conds):
        parsed = []
        for cond in conds:
            ctype = cond.get('type')
            
            # 1) TA-Lib 캔들 패턴 처리
            if ctype == 'candle_pattern':
                pattern = cond['params']['pattern']
                try:
                    if(pattern == 'CDLENGULFING_Bullish' or pattern == 'CDLENGULFING_Bearish'):
                        talib_func = getattr(bt.talib, 'CDLENGULFING')
                    else:
                        talib_func = getattr(bt.talib, pattern)
                except AttributeError:
                    raise ValueError(f"Unsupported candle pattern: {pattern}")


                indicator = talib_func(
                    self.data.open,
                    self.data.high,
                    self.data.low,
                    self.data.close
                )

                # ta-lib에서 상승, 하락 장악형은 한 함수의 양수 음수 값으로 판단하므로 따로 처리해줘야함
                if(pattern == 'CDLENGULFING_Bullish'):
                    parsed.append((indicator, 'bullish', None))
                elif(pattern == 'CDLENGULFING_Bearish'):
                    parsed.append((indicator, 'bearish', None))
                else:
                    parsed.append((indicator, 'pattern', None))

            # 2) 두 지표 비교
            elif ctype == 'indicator_compare':
                left = self._init_indicator(
                    cond['params']['indicator'][0],
                    cond['params']['settings'][0]
                )
                right = self._init_indicator(
                    cond['params']['indicator'][1],
                    cond['params']['settings'][1]
                )
                op = cond['params']['operator']
                if op in ('crossover', 'crossunder'):
                    parsed.append((bt.ind.CrossOver(left, right), op, None))
                else:
                    parsed.append((left, op, right))

            # 3) 지표 vs 상수 비교
            elif ctype == 'indicator':
                left = self._init_indicator(
                    cond['params']['indicator'][0],
                    cond['params']['settings'][0]
                )
                right = cond['params']['oversold']
                op = cond['params']['operator']
                if op in ('crossover', 'crossunder'):
                    parsed.append((bt.ind.CrossOver(left, right), op, None))
                else:
                    parsed.append((left, op, right))

            else:
                raise ValueError(f"Unsupported condition type: {ctype}")

        return parsed

    def _init_indicator(self, name: str, params: dict) -> bt.Indicator:
        name = name.lower()
        period = params.get('period', 14)
        if name == 'ema':
            return bt.ind.EMA(self.data.close, period=period)
        if name == 'sma':
            return bt.ind.SMA(self.data.close, period=period)
        if name == 'rsi':
            return bt.ind.RSI(self.data.close, period=period)
        if name == 'macd': # macd histo 기준이다
            fast = params.get('fastPeriod', 12)
            slow = params.get('slowPeriod', 26)
            signal = params.get('signalPeriod', 9)

        #     macd_hist = bt.ind.MACDHisto(
        #        self.data.close,
        #        period_me1=fast,
        #        period_me2=slow,
        #        period_signal=signal
        #     )
        #   # 나중에 next() 에서 찍기 위해 속성에 저장
        #     self.macd_hist = macd_hist
        #     return macd_hist
        # 1) fast/slow EMA
            ema_fast = bt.ind.EMA(self.data.close, period=fast)
            ema_slow = bt.ind.EMA(self.data.close, period=slow)
            # 2) MACD line = fastEMA - slowEMA
            macd_line = ema_fast - ema_slow
            # 3) signal line = EMA(macd_line, signalPeriod)
            signal_line = bt.ind.EMA(macd_line, period=signal)
            # 4) histogram = macd_line - signal_line
            hist = macd_line - signal_line

            # 나중에 next() 에서 찍기 위해 저장
            self.macd_hist = hist
            return hist

        raise ValueError(f"Unsupported indicator: {name}")

    def _compare(self, a, b, op: str) -> bool:
          
        # 상승장악형
        if op == 'bullish':
            return a[0] > 0
        # 하락장악형 
        if op == 'bearish':
            return a[0] < 0
        # 캔들 패턴 발생 여부    
        if op == 'pattern':
            return a[0] != 0

        # 크로스오버 / 크로스언더
        if op == 'crossover':
            return a[0] > 0
        if op == 'crossunder':
            return a[0] < 0

        # 값이 없는 경우 False
        if a[0] is None or (hasattr(b, '__getitem__') and b[0] is None):
            return False

        # b가 상수인지 시리즈인지 구분
        rhs = b if not hasattr(b, '__getitem__') else b[0]
        ops = {
            '>':  a[0] > rhs,
            '<':  a[0] < rhs,
            '>=': a[0] >= rhs,
            '<=': a[0] <= rhs,
            '==': a[0] == rhs
        }
        return ops.get(op, False)

    def next(self):
        current_dt = self.datas[0].datetime.datetime(0)
        # next_open 직접 호출
        self.next_open()

        if current_dt < self.start_dt:
            return

        # 1) 열린 포지션이 있으면 매 바마다
        if self.open_trade:
            entry_price   = self.open_trade['entry_price']
            size          = self.open_trade['size']
            qty           = abs(size)

            high_price = self.data.high[0]
            low_price  = self.data.low[0]

            # 절대 PnL
            low_pnl  = (low_price  - entry_price) * qty if size > 0 else (entry_price - low_price)  * qty
            high_pnl = (high_price - entry_price) * qty if size > 0 else (entry_price - high_price) * qty

            # 퍼센트 PnL
            low_pnl_pct  = (low_pnl  / (entry_price * qty)) * 100
            high_pnl_pct = (high_pnl / (entry_price * qty)) * 100

            # MFE (최대 유리 변동)
            self.open_trade['runup']     = max(self.open_trade['runup'],     high_pnl)
            self.open_trade['runup_pct'] = max(self.open_trade['runup_pct'], high_pnl_pct)
            # MAE (최대 불리 변동)
            self.open_trade['drawdown']       = min(self.open_trade['drawdown'],       low_pnl)
            self.open_trade['drawdown_pct']   = min(self.open_trade['drawdown_pct'],   low_pnl_pct)

        # buy_signal = all(self._compare(a, b, op)
                            # for a, op, b in self.buy_conditions)
        # print(f"[{current_dt}] [DEBUG BUY] buy_signal = {buy_signal}")
        
        sell_signal = any(self._compare(a, b, op)
                          for a, op, b in self.sell_conditions)


        # # 진입
        # if not self.position and buy_signal:
        #     o, h, l, c = (
        #         self.data.open[0], self.data.high[0],
        #         self.data.low[0], self.data.close[0]
        #     )
        #     print(f"[BUY] {current_dt} O={o:.2f} H={h:.2f} L={l:.2f} C={c:.2f}")
        #     self.buy()
            # exectype=bt.Order.Market
        # 청산
        if self.position.size > 0 and sell_signal:
            #print(f"[CLOSE LONG] {current_dt} → 매도")
            self.close()

    def next_open(self):
        """다음 봉의 시가에 매수 로직 처리"""
        dt = self.data.datetime.datetime(0)
        #print(f"▶ next_open called at {dt}, position={self.position.size}")
        buy_signal = all(self._compare(a,b,op) for a,op,b in self.buy_conditions)
        #print(f"  buy_signal = {buy_signal}")

        if dt < self.start_dt or self.position or not buy_signal:
            return
        o = self.data.open[0]
        #print(f"[BUY @ OPEN] {dt} O={o:.2f}")
        self.buy(exectype=bt.Order.Market, cheat=True)

    def notify_order(self, order):
        if order.status != order.Completed:
            return
        dt = self.data.datetime.datetime(0)
        price = order.executed.price
        size = order.executed.size
        comm = order.executed.comm

        # 진입 기록
        if self.open_trade is None and size != 0:
            self.open_trade = {
                'entry_dt':         dt,
                'entry_price':      price,
                'size':             size,
                'comm':             comm,
                'runup':     float('-inf'),
                'runup_pct': float('-inf'),
                'drawdown':       float('inf'),
                'drawdown_pct':   float('inf'),
            }
            return

        # 청산 기록 및 PnL 계산
        if self.open_trade and size * self.open_trade['size'] < 0:
            entry = self.open_trade
            qty = abs(entry['size'])
            raw_pnl = ((price - entry['entry_price']) * qty
                       if entry['size'] > 0
                       else (entry['entry_price'] - price) * qty)
            total_comm = entry['comm'] + comm
            net_pnl = raw_pnl - total_comm

            self.trades.append({
                'entry_time':     entry['entry_dt'].strftime("%Y-%m-%d %H:%M:%S"),
                'exit_time':      dt.strftime("%Y-%m-%d %H:%M:%S"),
                'entry_price':    round(entry['entry_price'], 2),
                'exit_price':     price,
                'size':           round(qty, 8),
                'pnl':            round(net_pnl, 2),
                'percent':        round(net_pnl * 100 / (qty * entry['entry_price']), 2),
                'commission':     round(total_comm, 8),
                'runup':    round(entry['runup'],     2),
                'runup_pct':round(entry['runup_pct'], 2),
                'drawdown':      round(entry['drawdown'],       2),
                'drawdown_pct':  round(entry['drawdown_pct'],   2),
            })

            self.total_commission += total_comm
            self.order_count += 1
            self.open_trade = None

    def stop(self):
        # 종료 시 미청산 포지션 처리
        if not self.open_trade:
            return
        entry = self.open_trade
        last_dt = self.data.datetime.datetime(0)
        last_price = self.data.close[0]
        qty = abs(entry['size'])
        raw_pnl = ((last_price - entry['entry_price']) * qty
                   if entry['size'] > 0
                   else (entry['entry_price'] - last_price) * qty)
        total_comm = entry['comm']
        net_pnl = raw_pnl - total_comm

        self.trades.append({
            'entry_time': entry['entry_dt'].strftime("%Y-%m-%d %H:%M:%S"),
            'exit_time': last_dt.strftime("%Y-%m-%d %H:%M:%S"),
            'entry_price': round(entry['entry_price'], 2),
            'exit_price': round(last_price, 2),
            'size': round(qty, 8),
            'pnl': round(net_pnl, 2),
            'percent' :  round(net_pnl*100 / (round(qty, 8) * round(entry['entry_price'], 2)),2),
            'commission': round(total_comm, 8),
            'runup':    round(entry['runup'],     2),
            'runup_pct':round(entry['runup_pct'], 2),
            'drawdown':      round(entry['drawdown'],       2),
            'drawdown_pct':  round(entry['drawdown_pct'],   2),
            'unrealized': True,
        })


def run_backtest(
    df,
    buy_conditions,
    sell_conditions,
    start_date,
    symbol: str = "BTCUSDT",
    exchange: str = "BINANCE",
    initial_cash: float = 1_000_000,
    commission: float = 0.001,
    fractional: bool = True,
    orderSize: float = 100
):
    cerebro = bt.Cerebro()
    cerebro.broker.set_coc(False)  

        # 1) UTC 로컬라이즈
    df.index = df.index.tz_localize('UTC')
    # 2) Asia/Seoul 로 변환
    df.index = df.index.tz_convert('Asia/Seoul')
    # 3) tzinfo 제거 → 이제 인덱스 자체가 KST naive datetime
    df.index = df.index.tz_localize(None)

    data = bt.feeds.PandasData(dataname=df)
    data.cheat_on_open = True

    cerebro.broker.setcash(initial_cash)
    cerebro.broker.setcommission(commission=commission/100)

    step = MIN_ORDER_SIZE.get(exchange.upper(), {}).get(symbol.upper(), 0.0001)
    if fractional:
        cerebro.addsizer(CustomSizer, step=step, percents=orderSize)
    else:
        cerebro.addsizer(bt.sizers.FixedSize, stake=orderSize)

    cerebro.addstrategy(
        JSONStrategy,
        buy_conditions=buy_conditions,
        sell_conditions=sell_conditions,
        startdate=start_date
    )



    # 데이터 피드에도 COC 켜기
    # ③ PandasData 피드를 만들 때 cheat_on_open=True 로 넘겨야 합니다.

    cerebro.adddata(data)

    strat = cerebro.run()[0]
    final_value = cerebro.broker.getvalue()

    total_commission = sum(t['commission'] for t in strat.trades)

    # total_percent = sum(t['percent'] for t in strat.trades)
    total_percent = ((final_value - initial_cash)/initial_cash)*100

    return {
        'message': '백테스트 완료',
        'initial_cash': initial_cash,
        'final_value': round(final_value, 2),
        'profit': round(final_value - initial_cash, 2),
        'total_percent': round(total_percent,2),
        'total_commission': round(total_commission, 2),
        'trade_count': strat.order_count,
        'trades': strat.trades,
        'count': len(df),
    }
