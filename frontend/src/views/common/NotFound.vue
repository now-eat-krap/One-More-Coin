<template>
  <div class="not-found">
    <div class="emoji">🧐</div>
    <h1>404</h1>
    <h2>페이지를 찾을 수 없습니다</h2>
    <p>요청하신 페이지가 존재하지 않거나, 이동되었을 수 있습니다.</p>
  </div>
</template>

<script setup>
// 별도 스크립트 필요 없음
</script>

<style scoped>
.not-found {
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
  font-size: 3rem;
  margin-bottom: 0.2rem;
}
h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
p {
  color: #666;
  font-size: 1.1rem;
}
</style> 