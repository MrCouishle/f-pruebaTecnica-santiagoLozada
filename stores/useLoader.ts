import { defineStore } from "pinia";

export const useLoader = defineStore("useLoader", {
  state: () => ({
    loader: false,
  }),
  actions: {
    onLoader() {
      this.loader = true;
    },
    offLoader() {
      this.loader = false;
    },
  },
});
