<template>
  <div class="results-container">
    <div
      v-for="(result, index) in visibleResults"
      :key="index"
      class="result-box"
      :class="result.color"
    >
      {{ result.number }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  results: {
    type: Array,
    default: () => [],
  },
});

const visibleResults = computed(() => {
  return props.results.slice(0, 10);
});
</script>

<style scoped>
.results-container {
  display: flex;
  gap: 8px;
  margin-top: 24px;
  justify-content: center;
  flex-wrap: nowrap;
}

.result-box {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
  font-family: "Cinzel", serif;
}

.result-box.red {
  background-color: #d32f2f;
}

.result-box.black {
  background-color: #212121;
}

.result-box.green {
  background-color: #388e3c;
}
</style>
