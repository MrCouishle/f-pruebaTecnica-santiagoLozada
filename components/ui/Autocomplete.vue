<template>
  <v-autocomplete
    @update:modelValue="(val) => $emit('update:modelValue', val)"
    :menu-props="{ maxHeight: '200px' }"
    :placeholder="placeholder"
    v-model="modelValueLocal"
    :items="computedItems"
    variant="solo-filled"
    density="comfortable"
    :label="label"
    hide-details
    dense
    autocomplete="off"
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
  label: {
    type: String,
    default: "",
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
