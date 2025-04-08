<template>
  <v-autocomplete
    v-model="modelValueLocal"
    :items="computedItems"
    :placeholder="placeholder"
    :menu-props="{ maxHeight: '200px' }"
    variant="solo-filled"
    hide-details
    density="comfortable"
    dense
    @update:modelValue="$emit('update:modelValue', modelValueLocal)"
  />
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [Number, String, null],
    default: null,
  },
  placeholder: {
    type: String,
    default: "Escribe o selecciona un número",
  },
  items: {
    type: Array,
    default: () => [],
  },
  useInternalNumbers: {
    type: Boolean,
    default: true,
  },
});

const modelValueLocal = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    modelValueLocal.value = val;
  }
);

// Si useInternalNumbers es true, se generan los números del 0 al 36
const computedItems = computed(() => {
  return props.useInternalNumbers
    ? Array.from({ length: 37 }, (_, i) => i.toString())
    : props.items;
});
</script>
