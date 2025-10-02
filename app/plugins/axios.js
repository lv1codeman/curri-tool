// plugins/axios.js

import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const curridataAPI = axios.create({
    baseURL: config.public.apiBaseUrl,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true", //讓ngrok訪問頁不再顯示
    },
  });

  return {
    provide: {
      curridataAPI,
    },
  };
});
