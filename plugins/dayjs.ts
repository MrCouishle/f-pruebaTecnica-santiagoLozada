import localeData from "dayjs/plugin/localeData";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { ref } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/es";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("dayjs", dayjs);
});

dayjs.extend(localeData);
dayjs.extend(timezone);
dayjs.locale("es");
dayjs.extend(utc);
dayjs.tz.setDefault("America/Bogota");

export const currentTime = (format?: string): Ref<string> => {
  let currentTime = ref(dayjs().tz().format("YYYY-MM-DD HH:mm:ss"));
  if (format != "") {
    currentTime = ref(dayjs().tz().format(format));
  }

  return currentTime;
};

export const useDayJs = (value: string, format = "YYYY-MM-DD hh:mm A") => {
  const formatDateJs = dayjs(value).format(format);
  return formatDateJs;
};
