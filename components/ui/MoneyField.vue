<template>
  <v-text-field
    :prepend-inner-icon="prependIcon"
    :model-value="formattedValue"
    @update:model-value="onInput"
    @keypress="onlyAllowNumbers"
    :class="backgroundClass"
    density="comfortable"
    variant="solo-filled"
    :disabled="disabled"
    inputmode="numeric"
    v-bind="$attrs"
    :label="label"
    hide-details
  />
</template>

<script setup lang="ts">
const props = defineProps({
  label: String,
  prependIcon: String,
  modelValue: {
    type: [Number, String],
    required: true,
  },
  disabled: Boolean,
  backgroundClass: {
    type: String,
    default: "",
  },
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

const onlyAllowNumbers = (e: KeyboardEvent) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Delete"];
  const isNumber = /^[0-9]$/.test(e.key);
  if (!isNumber && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
};

const onInput = (val: string) => {
  const cleaned = val.replace(/[^\d]/g, "");
  const numericValue = parseFloat(cleaned) / 100;
  emit("update:modelValue", numericValue);
};
</script>
