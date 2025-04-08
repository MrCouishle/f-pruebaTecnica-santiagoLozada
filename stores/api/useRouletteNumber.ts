import { defineStore } from "pinia";

export const useRouletteNumber = defineStore("useRouletteNumber", {
  state: () => ({
    rouletteNumber: {} as IRouletteNumber,
  }),
  getters: {},
  actions: {
    async getRouletteNumbers() {
      try {
        const response = await apiRequest({
          endpoint: `/rouletteNumber/getRouletteNumbers`,
          method: "get",
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
