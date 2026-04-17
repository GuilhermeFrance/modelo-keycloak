import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify, Loading, QSpinnerBall, useQuasar } from 'quasar';
import keycloak from 'src/plugins/keycloak';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    isAdmin: false,
    idUser: '',
    nameUser: '',
  }),

  actions: {
    initFromKeyCloak() {
      this.isAuthenticated = keycloak.authenticated ?? false;
      const parsed = keycloak.tokenParsed;
      if (parsed) {
        this.nameUser = parsed.name || parsed.preferred_username || '';
        this.idUser = parsed.sub || '';
      }
      this.isAdmin = keycloak.hasRealmRole('admin');
    },
    logout() {
      keycloak.logout({ redirectUri: window.location.origin });
    },
  },
});
