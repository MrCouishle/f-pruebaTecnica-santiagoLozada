import dayjs from "dayjs";

declare module "#app" {
  interface NuxtApp {
    $dayjs: typeof dayjs;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $dayjs: typeof dayjs;
  }
}
