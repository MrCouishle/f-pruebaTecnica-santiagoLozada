<template>
  <v-btn :color="color" v-bind="$attrs" class="base-button">
    <template v-if="props.prepend">
      <v-icon :color="props.prependColor ?? 'white'"></v-icon>
    </template>

    {{ text }}

    <template v-if="props.append">
      <v-icon :color="props.appendColor ?? 'white'"></v-icon>
    </template>
  </v-btn>
</template>

<script setup lang="ts">
const props = defineProps({
  text: { type: String, required: true },
  color: { type: String, required: false },
  append: { type: Boolean, default: false },
  prepend: { type: Boolean, default: false },
  appendColor: { type: String, default: "" },
  prependColor: { type: String, default: "" },
});
</script>
