import { route } from 'quasar/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/authStore';

export default route(function (/*{ store, ssrContext }*/) {
  const authStore = useAuthStore();

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    try {
      //verifica a autenticação do usuário
      if (to.meta.requiredLogin && !authStore.$state.isAuthenticated) {
        next({ name: 'login' });
        return;
      }

      //verifica os níveis de acesso
      if (to.path !== '/login' && to.path !== '/' && to.meta.requiredLogin) {
        const id = window.sessionStorage.getItem('user_id');
        const token = window.sessionStorage.getItem('token');

        if (!id || !token) {
          next({ name: 'login' });
          return;
        }

        await authStore.getUserAccessLevel(id, token);

        const accessLevel = window.sessionStorage.getItem('access_level');

        if (
          to.meta.requiredAdminLevel &&
          accessLevel !== 'ADMIN'
          // || ((to?.meta.requiredOutroNivelDeAcesso) && accessLevel !== "OutroNivelDeAcesso")
        ) {
          next({
            name: 'error',
          });
          return;
        }
      }

      //se passar por todas as verificações, segue a navegação
      next();
    } catch (error) {
      console.error('Erro no router guard:', error);
      next({ name: 'login' });
    }
  });

  return Router;
});
