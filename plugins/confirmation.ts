import { defineStore } from "pinia";

const defaultData: ConfirmationData = {
  message: "Sin mensaje.",
  title: "Atención",
  type: "warning",
  active: false,
  cancel: null,
  ok: null,
};

export default defineNuxtPlugin((nuxtApp) => {
  const useConfirmation = defineStore("useConfirmation", {
    state: (): { base: ConfirmationData } => ({
      base: { ...defaultData },
    }),
    actions: {
      closeConfirmation() {
        this.base = { ...defaultData };
      },
      callConfirmation(params: ConfirmationData) {
        if (typeof params !== "object" || params === null) {
          console.error("`params` must be an object:", params);
          return;
        }
        params.active = true;
        Object.assign(this.base, params);
      },
    },
  });

  const confirmationStore = useConfirmation();

  nuxtApp.provide("useConfirmation", confirmationStore);
  nuxtApp.provide("dataConfirmation", confirmationStore.base);
  nuxtApp.provide(
    "callConfirmation",
    confirmationStore.callConfirmation.bind(confirmationStore)
  );
  nuxtApp.provide(
    "closeConfirmation",
    confirmationStore.closeConfirmation.bind(confirmationStore)
  );
});
