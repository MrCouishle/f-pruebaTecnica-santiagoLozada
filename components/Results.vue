<template>
  <div class="results-container">
    <div
      v-for="(result, index) in props.results"
      :class="result.color"
      class="result-box"
      :key="index"
    >
      <div class="number">{{ result.number }}</div>
      <div class="parity">{{ isEven(result.number) ? "Par" : "Impar" }}</div>
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

const isEven = (num) => num % 2 === 0;
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
  width: 48px;
  height: 56px;
  border-radius: 4px;
  font-weight: bold;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
  font-family: "Cinzel", serif;
  text-align: center;
  padding: 4px 0;
}

.result-box .number {
  font-size: 16px;
  line-height: 1;
}

.result-box .parity {
  font-size: 11px;
  opacity: 0.85;
  line-height: 1;
  margin-top: 2px;
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
