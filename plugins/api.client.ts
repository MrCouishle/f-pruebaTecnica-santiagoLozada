import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const loaderStore = useLoader();
  // const baseURL = `http://108.166.183.149/api-roulette`;
  const baseURL = `http://localhost:5294`;

  const $axios = axios.create({
    baseURL: baseURL,
    headers: { "Content-Type": "application/json" },
  });

  $axios.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    loaderStore.onLoader();
    return config;
  });

  $axios.interceptors.response.use(
    (response) => {
      loaderStore.offLoader();
      return response?.data;
    },
    (error) => {
      loaderStore.offLoader();

      const status = error.response ? error.response.status : null;

      const errorResponse = {
        success: false,
        type: error?.response?.data?.type || "error",
        message: error.response?.data.message || "Unknown error.",
      };
      if (!error.response?.data.message) {
        if (status === 401) {
          errorResponse.message =
            "You do not have the necessary permissions to access this information.";
        } else if (status === 404) {
          errorResponse.type = "warning";
          errorResponse.message = "Resource not found.";
        } else if (status >= 500) {
          errorResponse.message = "A server error occurred. Please try again later.";
        }

        if (error.message === "Network Error") {
          errorResponse.type = "error";
          errorResponse.message =
            "The connection to the server could not be established.";
        }

        if (status === 400 && error.response?.data.errors) {
          const mensajes = (Object.values(
            error.response?.data.errors
          )[0] as string[]) || [`Error ${status}`];
          errorResponse.type = "info";
          errorResponse.message = mensajes[0] || "Invalid request";
        }
      }

      return Promise.reject(errorResponse.message);
    }
  );

  type ApiMethod = "get" | "post" | "put" | "delete";

  const apiRoulette = async <T>(
    url: string,
    params: Record<string, any> = {},
    method: ApiMethod = "get",
    data: Record<string, any> = {},
    isFile: boolean = false
  ): Promise<T> => {
    try {
      const headers =
        isFile && !(data instanceof FormData)
          ? { "Content-Type": "multipart/form-data" }
          : undefined;

      const response = await $axios({
        url,
        method,
        params,
        data,
        headers,
      });
      return response as T;
    } catch (error: any) {
      return error as T;
    } finally {
      loaderStore.offLoader();
    }
  };

  nuxtApp.provide("apiRoulette", apiRoulette);
});

const getClientBaseUrl = () => {
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    const port = "5294";

    return `${protocol}//${hostname}:${port}`;
  }
};
