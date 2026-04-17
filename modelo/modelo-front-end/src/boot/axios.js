import { boot } from 'quasar/wrappers'
import axios from 'axios'
import keycloak from 'src/plugins/keycloak';

const api = axios.create({ baseURL: process.env.API_BASE_URL })

api.interceptors.request.use(async (config) => {
  await keycloak.updateToken(30).catch(() => keycloak.logout())
  config.headers.Authorization = `Bearer ${keycloak.token}`;
  return config;
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
