<template>
  <v-snackbar
    v-model="visible"
    :timeout="4000"
    :color="color"
    location="top end"
    multi-line
    class="rounded-lg"
  >
    <div class="d-flex align-center">
      <v-icon class="me-3" size="30">{{ icon }}</v-icon>
      <div>
        <div class="text-subtitle-1 font-weight-bold">{{ title }}</div>
        <div>{{ message }}</div>
      </div>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useNuxtApp } from "#app";
import { ref, watch } from "vue";

const { $useNotification, $offNotification } = useNuxtApp();

// Le damos tipo al store para evitar el "unknown"
const store = $useNotification as {
  base: NotificationParams;
};

// Refs reactivas para el snackbar
const visible = ref(false);
const title = ref("");
const message = ref("");
const color = ref("primary");
const icon = ref("mdi-information");

// Tipado explícito
const typeMap = {
  info: {
    title: "¡Atención!",
    color: "info",
    icon: "mdi-information",
  },
  success: {
    title: "¡Realizado!",
    color: "success",
    icon: "mdi-check-circle",
  },
  warning: {
    title: "¡Precaución!",
    color: "warning",
    icon: "mdi-alert",
  },
  error: {
    title: "¡Error!",
    color: "error",
    icon: "mdi-close-circle",
  },
} as const;

// Escucha el cambio del estado y muestra el snackbar
watch(
  () => store.base,
  (params) => {
    if (!params?.message) return;

    const typeData = typeMap[params.type || "info"];
    title.value = params.title || typeData.title;
    message.value = params.message || "";
    color.value = typeData.color;
    icon.value = typeData.icon;

    visible.value = true;

    setTimeout(() => {
      visible.value = false;
      $offNotification();
    }, 2000);
  },
  { deep: true }
);
</script>
