<template>
  <v-text-field
    v-bind="$attrs"
    :label="label"
    :disabled="disabled"
    :prepend-inner-icon="prependIcon"
    :model-value="formattedValue"
    @update:model-value="onInput"
    hide-details
    density="comfortable"
    variant="solo-filled"
    inputmode="numeric"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  label: String,
  prependIcon: String,
  modelValue: {
    type: [Number, String],
    required: true,
  },
  disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const formatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 2,
});

const formattedValue = computed(() => {
  const n = parseFloat(props.modelValue as string);
  return isNaN(n) ? "" : formatter.format(n);
});

const onInput = (val: string) => {
  const cleaned = val.replace(/[^\d]/g, ""); // quitamos todo lo que no sea número
  const numericValue = parseFloat(cleaned) / 100; // convertimos a decimal con centavos
  emit("update:modelValue", numericValue);
};
</script>
