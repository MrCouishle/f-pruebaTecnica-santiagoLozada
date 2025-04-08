import { defineStore } from "pinia";

export const useResult = defineStore("useResult", {
  state: () => ({
    result: {} as IResult,
  }),
  getters: {},
  actions: {
    async getResults() {
      try {
        const response = await apiRequest({
          endpoint: `/result/getResults`,
          method: "get",
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    create({ result }: { result: IResult }) {
      return apiRequest({
        endpoint: `/result`,
        showNotify: true,
        method: "post",
        body: result,
      });
    },
  },
});
