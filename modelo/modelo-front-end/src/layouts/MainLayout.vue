<template>
  <q-layout view="hHh Lpr lff">
    <q-header>
      <q-toolbar class="row justify-around bg-blue-10">
        <div class="col-xs-6 col-sm-1">
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            size="lg"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
        </div>

        <div class="xs-hide col-sm-5">
          <q-toolbar-title style="line-height: normal">
            <q-icon size="25px" name="feed" class="q-mr-xs" />
            Modelo Front-end CTI
          </q-toolbar-title>
        </div>

        <div
          class="xs-hide col-sm-4 flex justify-center content-center"
          style="font-size: 1.1rem; color: white"
        >
          Olá
          <strong class="q-ml-xs"> {{ userName }}</strong
          >, seja bem vindo!
        </div>

        <div
          class="col-xs-6 col-sm-2 items-center flex justify-end content-center q-py-xs"
          style="text-align: right"
        >
          <q-btn
            color="white"
            class="text-blue"
            :label="access"
            icon="account_circle"
          >
            <q-menu fit anchor="bottom left" self="top left" :offset="[2, 2]">
              <q-item
                clickable
                tag="a"
                @click="profile"
                exact
                class="row items-center"
              >
                <q-item-section>Perfil</q-item-section>
                <q-icon name="account_circle" size="sm" />
              </q-item>
              <q-item
                clickable
                tag="a"
                @click="logout"
                exact
                class="row items-center"
              >
                <q-item-section>Sair</q-item-section>
                <q-icon name="logout" size="sm" />
              </q-item>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-blue-1 10 q-py-md"
    >
      <q-list>
        <EssentialLink v-for="link in links" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-10 q-pa-xs text-white text-center">
      <span>Desenvolvido por CTI</span>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import EssentialLink from 'components/common/EssentialLink.vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/authStore';

onMounted(() => {
  configurarMenu();
});

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
const leftDrawerOpen = ref(false);
const access = ref('');
const userName = ref('');
const links = ref([]);

function getFirstName(name) {
  const firstName = name.split(' ')[0];
  return (userName.value = firstName);
}

function configurarMenu() {
  const accessLevel = window.sessionStorage.getItem('access_level');
  const userName = window.sessionStorage.getItem('name_user');
  getFirstName(userName ? userName : 'Maria Silva');
  if (accessLevel === 'ADMIN') {
    // ITENS DE NAVEGAÇÃO ADMIN

    links.value.push(
      {
        title: 'Início',
        icon: 'home',
        link: `/admin/`,
      },
      {
        title: 'Perfil',
        icon: 'account_circle',
        link: `/perfil`,
      },
      {
        title: 'Usuários',
        icon: 'group',
        link: '/usuarios',
      },
    );

    access.value = 'admin';
  } else {
    // ITENS DE NAVEGAÇÃO USUARIO

    links.value.push(
      {
        title: 'Início',
        icon: 'home',
        link: `/usuario/`,
      },
      {
        title: 'Perfil',
        icon: 'account_circle',
        link: `/perfil`,
      },
    );

    access.value = 'Usuário';
  }
}

async function profile() {
  router.push('/perfil');
}

async function logout() {
  router.push('/login');
  authStore.logout();
}
</script>
