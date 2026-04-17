import { route } from 'quasar/wrappers';
import { createRouter, createWebHistory } from 'vue-router';
import keycloak from 'src/plugins/keycloak';
import routes from './routes';

export default route(function () {
  const Router = createRouter({
    history: createWebHistory(),
    routes,
  });

  Router.beforeEach((to, from, next) => {
    if (!keycloak.authenticated) {
      next(false);
      return;
    }

    const isAdmin =
      keycloak.hasRealmRole('admin') ||
      keycloak.hasResourceRole('admin', keycloak.clientId);

    if (to.meta.requiredAdminLevel && !isAdmin) {
      next({ name: 'error' });
      return;
    }
    next();
  });

  return Router;
});
