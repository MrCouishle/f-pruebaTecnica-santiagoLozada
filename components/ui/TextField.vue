<template>
  <v-text-field
    :model-value="formattedValue"
    @input="onInput"
    :prepend-inner-icon="prependIcon"
    :placeholder="placeholder"
    :label="label"
    :type="inputType"
    variant="solo-filled"
    density="comfortable"
    hide-details
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed, watch } from "vue";

const props = defineProps({
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: "text",
  },
  prependIcon: String,
  modelValue: {
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const inputType = computed(() =>
  props.type === "currency" ? "text" : props.type ?? "text"
);

const formattedValue = computed(() => {
  if (props.type === "currency") {
    const num = Number(props.modelValue);
    return isNaN(num)
      ? ""
      : num.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
  }
  return props.modelValue;
});

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (props.type === "currency") {
    const raw = target.value.replace(/[^\d]/g, "");
    const numericValue = parseInt(raw || "0", 10);
    emit("update:modelValue", numericValue);
  } else {
    emit("update:modelValue", target.value);
  }
};
</script>
