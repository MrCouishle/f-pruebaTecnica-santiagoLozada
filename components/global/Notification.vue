<template>
  <v-snackbar
    location="top end"
    class="rounded-lg"
    v-model="visible"
    :timeout="6000"
    :color="color"
    multi-line
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
const { $useNotification, $offNotification } = useNuxtApp();

const store = $useNotification as {
  base: NotificationParams;
};

const icon = ref("mdi-information");
const color = ref("primary");
const visible = ref(false);
const message = ref("");
const title = ref("");

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
