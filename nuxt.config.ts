// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  css: ["vuetify/styles"],
  build: {
    transpile: ["vuetify"],
  },
  app: {
    baseURL: "/roulette/",
    head: {
      title: "Roulette",
      link: [{ rel: "icon", type: "image/ico", href: "/roulette.ico" }],
    },
  },

  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/ui", "@nuxt/image", "@pinia/nuxt"],
  image: { inject: true, dir: "assets/images" },
  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },
  plugins: [
    "~/plugins/piniaPersisted.ts",
    "~/plugins/notification.ts",
    "~/plugins/api.ts",
  ],
});
