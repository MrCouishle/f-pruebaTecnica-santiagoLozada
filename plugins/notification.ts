import { defineStore } from "pinia";

const defaultData: NotificationParams = {
  type: null,
  title: null,
  message: null,
};

export default defineNuxtPlugin((nuxtApp) => {
  const useNotification = defineStore("useNotification", {
    state: (): { base: NotificationParams } => ({
      base: { ...defaultData } as NotificationParams,
    }),
    getters: {
      getBase(): NotificationParams {
        return this.base;
      },
    },
    actions: {
      callNotification(params: NotificationParams) {
        if (typeof params !== "object" || params === null) {
          console.error("`params` debe ser un objeto:", params);
          return;
        }
        params.title = params.title || "Atención";
        params.type = params.type ?? "info";
        Object.assign(this.base, params);

        this.base = { ...params };
      },
      offNotification() {
        Object.assign(this.base, defaultData);
      },
    },
  });

  const notificationStore = useNotification();

  nuxtApp.provide("useNotification", notificationStore);
  nuxtApp.provide(
    "callNotification",
    notificationStore.callNotification.bind(notificationStore)
  );
  nuxtApp.provide(
    "offNotification",
    notificationStore.offNotification.bind(notificationStore)
  );
});
