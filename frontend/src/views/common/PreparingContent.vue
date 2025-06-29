<template>
  <div class="preparing-content">
    <div class="emoji">🚧</div>
    <h1>콘텐츠 준비중입니다</h1>
    <p>빠른 시일 내에 준비해서 찾아뵙겠습니다.</p>
  </div>
</template>

<script setup>
// 별도 스크립트 필요 없음
</script>

<style scoped>
.preparing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}
.emoji {
  font-size: 4rem;
  margin-bottom: 1rem;
}
h1 {
  margin-bottom: 0.5rem;
  font-size: 2rem;
}
p {
  color: #666;
  font-size: 1.1rem;
}
</style> 