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
        return response;
      } catch (error) {
        throw error;
      }
    },
    async getValidateResult({
      userId,
      betValue,
      betNumber,
      resultNumber,
      betColor,
      evenOdd,
    }: {
      userId: string;
      betValue: number;
      betNumber: number;
      resultNumber: number;
      betColor: string;
      evenOdd: string;
    }) {
      try {
        const response = await apiRequest({
          endpoint: `/result/getValidateResult`,
          params: { userId, betValue, betNumber, resultNumber, betColor, evenOdd },
          method: "get",
        });
        console.log("🚀 ~ response:", response);
        return response;
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
