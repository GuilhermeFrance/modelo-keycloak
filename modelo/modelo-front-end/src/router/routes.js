const routes = [

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('pages/RedirectPage.vue'),
      },
      {
        path: '/perfil',
        component: () => import('pages/common/Profile.vue'),
      },
      {
        path: '/admin/',
        meta: { requiredLogin: true, requiredAdminLevel: true },
        children: [
          {
            path: '',
            component: () => import('pages/admin/Dashboard.vue'),
          },
          {
            path: '/usuarios',
            component: () => import('pages/admin/users/ListUsers.vue'),
          },
          {
            path: '/usuarios/adicionar',
            component: () => import('pages/admin/users/UserActionsForm.vue'),
          },
          {
            path: '/usuarios/editar/:id',
            component: () => import('pages/admin/users/UserActionsForm.vue'),
          },
        ],
      },
      {
        path: '/usuario/',
        children: [
          {
            path: '',
            component: () => import('pages/user/HomeUser.vue'),
          },
          {
            path: '/editar/:id',
            component: () => import('pages/admin/users/UserActionsForm.vue'),
          },
        ],
      },
    ],
  },
  {
    name: 'error',
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
