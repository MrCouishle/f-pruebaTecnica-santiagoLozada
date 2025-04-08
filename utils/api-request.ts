import { useNuxtApp } from "#app";

export const apiRequest = async ({
  endpoint,
  params,
  method,
  body,
  showNotify = false,
  isList = false,
}: {
  endpoint: string;
  params?: any;
  method: string;
  body?: any;
  showNotify?: boolean;
  isList?: boolean;
}) => {
  const { $apiRoulette, $callNotification } = useNuxtApp();
  try {
    const response = await $apiRoulette(endpoint, params, method, body);

    if (showNotify) {
      $callNotification({
        type: response.type,
        message: response.message || "Request completed successfully",
      });
    }
    if (response.success === false) {
      throw response;
    }
    if (isList) {
      return { data: response.data, listData: response.listData };
    }

    return response.data;
  } catch (error: any) {
    console.error("api-request", error);
    if (showNotify || isList) {
      $callNotification({
        type: error.type || "error",
        message: error.message || "An error occurred",
      });
    }
    throw error;
  }
};
