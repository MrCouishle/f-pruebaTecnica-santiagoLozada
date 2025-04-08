import { defineStore } from "pinia";

export const useUser = defineStore("useUser", {
  state: () => ({
    user: {} as IUser,
  }),
  getters: {},
  actions: {
    async getUsers() {
      try {
        const response = await apiRequest({
          endpoint: `/user/getUsers`,
          method: "get",
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getUser({ name }: { name: string }) {
      try {
        const response = await apiRequest({
          endpoint: `/user/getUser`,
          params: { name },
          method: "get",
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    create({ user }: { user: IUser }) {
      return apiRequest({
        endpoint: `/user`,
        showNotify: true,
        method: "post",
        body: user,
      });
    },
  },
});
