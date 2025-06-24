# app/services/custom_sizer.py

import backtrader as bt
import math

class CustomSizer(bt.Sizer):
    params = (
        ("step",    0.0001),   # 심볼별 최소 주문 단위
        ("percents",100),      # 투자 비율(%)
    )

    def getsizing(self, data, isbuy):
        cash   = self.broker.get_cash()
        price  = data.close[0]
        if price <= 0:
            return 0

        # 브로커에 세팅된 커미션율 가져오기
        comminfo = self.broker.getcommissioninfo(data)
        comm_rate = comminfo.p.commission  # percabs=False 일 때 비율

        # 커미션까지 포함한 필요 현금까지 커버하도록 조정
        alloc_cash = cash * self.params.percents / 100
        # (price * size) * (1 + comm_rate) <= alloc_cash  인 size 계산
        raw_size = alloc_cash / (price * (1 + comm_rate))

        # step 단위로 내림
        num_steps = math.floor(raw_size / self.params.step)
        size = num_steps * self.params.step

        print(f"[SIZER] cash={cash:.2f}, price={price:.2f}, "
              f"comm_rate={comm_rate:.6f}, raw_size_adj={raw_size:.6f}, "
              f"step={self.params.step}, size={size:.6f}")

        return size if size >= self.params.step else 0
