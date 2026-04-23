import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify, Loading, QSpinnerBall, useQuasar } from 'quasar';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    idUser: '',
    nameUser: '',
    token: '',
    isAuthenticated: false,
    isAdmin: false,
  }),

  actions: {
    async doLogin(payload) {
      Loading.show({
        message: 'Entrando em contato com servidor...',
        delay: 400,
        spinner: QSpinnerBall,
        spinnerColor: 'blue-10',
        spinnerSize: 140,
      });
      try {
        const response = await api.post('/auth/login', payload);
        this.setToken(response.data.accessToken);
        api.defaults.headers.common.Authorization =
          'Bearer ' + response.data.accessToken;

        // Busca os dados completos do usuário antes de redirecionar
        await this.getUserAccessLevel(
          response.data.userId,
          response.data.accessToken,
        );

        if (response.data.accessToken) {
          Notify.create({
            color: 'green-10',
            icon: 'done_all',
            position: 'top',
            timeout: 2000,
            message: 'Bem vindo de volta',
          });
        }
        Loading.hide();
      } catch (error) {
        console.log('Erro ao fazer login', error);
        Loading.hide();
        Notify.create({
          color: 'negative',
          icon: 'close',
          position: 'top',
          timeout: 2000,
          message: error.response.data.message,
        });
        throw error;
      }
    },

    setToken(token) {
      this.token = token;
      this.isAuthenticated = true;
      window.sessionStorage.setItem('token', token);
    },

    setUser(userId, userName = '') {
      this.idUser = userId;
      this.nameUser = userName;
      window.sessionStorage.setItem('user_id', userId);
      window.sessionStorage.setItem('name_user', userName);
    },

    setAccessLevel(level) {
      window.sessionStorage.setItem('access_level', level);
      if (level === 'ADMIN') {
        this.isAdmin = true;
      }
    },

    removeToken() {
      this.token = '';
      this.isAuthenticated = false;
      window.sessionStorage.removeItem('token');
    },

    removeUser() {
      this.idUser = '';
      this.nameUser = '';
      window.sessionStorage.removeItem('user_id');
      window.sessionStorage.removeItem('name_user');
    },

    removeAccessLevel() {
      this.isAdmin = false;
      window.sessionStorage.removeItem('access_level');
    },

    async initSystem() {
      const token = window.sessionStorage.getItem('token');
      if (token) {
        this.setToken(token);
      } else {
        this.removeToken();
      }
    },

    async getUserAccessLevel(payloadId, payloadToken) {
      const id = payloadId;
      const token = payloadToken;
      api.defaults.headers.common.Authorization = 'Bearer ' + token;
      const { data } = await api.get(`usuarios/${id}`);
      console.log(data);
      this.setAccessLevel(data.nivel);
      this.setUser(data.id, data.nome);
      return data.nivel;
    },

    logout() {
      api.defaults.headers.common.Authorization = '';
      this.removeUser();
      this.removeToken();
      this.removeAccessLevel();
    },
  },
});
