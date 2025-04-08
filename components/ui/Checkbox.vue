<template>
  <div class="checkbox-wrapper">
    <v-checkbox
      v-model="model"
      :label="label"
      :color="color"
      :value="value"
      hide-details
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: [String, Number, null, Boolean, Array],
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "primary",
  },
  value: {
    type: [String, Number, Boolean],
    default: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
