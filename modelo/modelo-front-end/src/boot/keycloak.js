import { boot } from "quasar/wrappers";
import keycloak from "src/plugins/keycloak";

export default boot(async({ app }) => {
  const authenticated = await keycloak
  .init({
    onLoad: 'login-required', //redireciona para login se não autenticado
    checkLoginIframe: false, // evita problemas com cookies SameSite
    pkceMethod: 'S256' //obrigatório para clients publicos
  })
  .catch((err) => {
    console.error('Falha ao inicializar o Keycloak: ', err);
  });
  if(!authenticated) {
    window.location.reload();
    return;
  }

  app.config.globalProperties.$keycloak = keycloak;
});
