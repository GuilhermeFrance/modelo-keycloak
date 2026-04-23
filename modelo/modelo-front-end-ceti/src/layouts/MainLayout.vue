<template>
  <q-layout view="lHh Lpr lFf" class="bg-slate-50 font-sans">
    <q-header
      class="bg-white text-pmvc-dark border-b border-slate-200 h-20 flex items-center shadow-none"
    >
      <q-toolbar class="!px-3 sm:px-8 ">
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="text-pmvc-blue mr-1 sm:mr-4 hover:bg-slate-100 "
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title class="flex items-center shrink-1">
          <div
            class="flex flex-nowrap items-center leading-none gap-1.5 sm:gap-2"
          >
            <q-img
              src="~assets/images/brasao-pmvc-2025.png"
              alt="Logo PMVC"
              class="!w-9 !h-15 md:!w-12 md:!h-15 "
            />
            <div class="flex flex-col justify-center">
              <span
                class="font-bold text-pmvc-blue tracking-tighter whitespace-nowrap transition-all duration-300 text-xs sm:text-xl"
              >
                MODELO
              </span>
              <span
                class="text-[8px] md:text-[10px] text-pmvc-gray tracking-widest uppercase whitespace-nowrap"
              >
                Modelo Front-End CETI
              </span>
            </div>
          </div>
        </q-toolbar-title>
        <div class="flex items-center gap-3 sm:gap-5">
          <div class="flex items-center gap-3">
            <div class="flex flex-col items-end gt-xs">
              <span
                class="text-pmvc-blue font-semibold text-sm leading-none mb-1"
              >
                {{ userName }}
              </span>
              <span
                class="text-xs text-pmvc-gray capitalize"
              >
                {{ acesso }}
              </span>
            </div>
            <q-btn round flat dense class="text-none user-avatar-btn">
              <div
                class="h-10 w-10 bg-pmvc-blue rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm hover:bg-pmvc-lightBlue transition-colors"
              >
                {{ getUserInitial(userName) }}
              </div>
              <q-menu
                anchor="bottom right"
                self="top right"
                class="shadow-xl border border-slate-100 rounded-xl mt-2"
              >
                <q-list style="min-width: 150px">
                  <q-item
                    clickable
                    v-close-popup
                    @click="profile"
                    class="text-pmvc-dark hover:text-pmvc-blue hover:bg-slate-50"
                  >
                    <q-item-section avatar>
                      <q-icon name="person_outline" size="xs" />
                    </q-item-section>
                    <q-item-section>Meu Perfil</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <div class="h-6 w-[1px] bg-slate-200 mx-1"></div>
            <q-btn
              flat
              round
              dense
              icon="power_settings_new"
              class="text-red-500 hover:bg-red-50 transition-colors"
              @click="requestLogout"
            >
              <q-tooltip class="bg-pmvc-blue text-white text-xs"
                >Sair do Sistema</q-tooltip
              >
            </q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
      class="bg-white text-pmvc-dark"
    >
      <div class="flex flex-col h-full py-6 px-3">
        <div class="mb-6 px-4">
          <p class="text-xs font-bold text-pmvc-gray uppercase tracking-wider">
            Menu Principal
          </p>
        </div>
        <q-list class="space-y-1">
          <router-link
            v-for="link in links"
            :key="link.title"
            :to="link.link"
            class="flex items-center px-4 py-3 rounded-lg text-pmvc-gray transition-all duration-200 group hover:bg-slate-50 hover:text-pmvc-blue"
            exact-active-class="!bg-pmvc-blue !text-white font-bold shadow-md shadow-slate-900/10"
          >
            <q-icon
              :name="link.icon"
              size="20px"
              class="mr-3 text-pmvc-gray group-hover:text-pmvc-blue transition-colors"
              :class="{ '!text-white': isActivePath(link.link) }"
            />
            <span class="text-sm">{{ link.title }}</span>
          </router-link>
        </q-list>
      </div>
    </q-drawer>
     
    <LogoutModal v-model="showModal" @confirm="logout" />

    <q-page-container class="bg-slate-50">
      <router-view />
    </q-page-container>
    <q-footer class="bg-white border-t border-slate-200 py-3 text-center">
      <p class="text-xs text-pmvc-gray m-0 px-4">
        Prefeitura Municipal de Vitória da Conquista - Desenvolvido por
        <span class="font-bold text-pmvc-blue">CETI</span>
      </p>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/authStore';
import LogoutModal from 'src/components/modals/ConfirmLogout.vue';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['update:isOpen']);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const leftDrawerOpen = ref(false);
const showModal = ref(false);

const acesso = ref('');
const userName = ref('');
const links = ref([]);

const ICONS = {
  INICIO: 'home',
  PERFIL: 'account_circle',
  USUARIOS: 'group',
};

const getUserInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : 'U';
};

const getFirstName = (fullName) => {
  if (!fullName) return '';
  const firstName = fullName.trim().split(' ')[0];
  return firstName;
};

const isActivePath = (link) => {
  const normalizedPath = route.path.replace(/\/$/, '') || '/';
  const normalizedLink = link.replace(/\/$/, '') || '/';
  return normalizedPath === normalizedLink;
};

const configurarMenu = () => {
  const nameFromStore = authStore.nameUser;
  const nameFromStorage = window.sessionStorage.getItem('name_user');
  
  const levelFromStore = authStore.isAdmin;
  const levelFromStorage = window.sessionStorage.getItem('access_level');
  
  userName.value = getFirstName(nameFromStore || nameFromStorage || 'Usuário');
  
  const isAdmin = levelFromStore || levelFromStorage === 'ADMIN';
  
  acesso.value = isAdmin ? 'Administrador' : 'Usuário';

  links.value = [];

  if (isAdmin) {
    links.value = [
      { title: 'Início', icon: ICONS.INICIO, link: '/admin/' },
      { title: 'Perfil', icon: ICONS.PERFIL, link: '/perfil' },
      { title: 'Usuários', icon: ICONS.USUARIOS, link: '/usuarios' },
    ];
  } else {
    links.value = [
      { title: 'Início', icon: ICONS.INICIO, link: '/usuario/' },
      { title: 'Perfil', icon: ICONS.PERFIL, link: '/perfil' },
    ];
  }
};

const modelValue = computed({
  get: () => props.isOpen,
  set: (val) => {
    if (val === false) {
      requestLogout();
    } else {
      emit('update:isOpen', val);
    }
  },
})

const profile = () => {
  router.push('/perfil');
};

function requestLogout() {
  showModal.value = true;
}

function confirmClose() {
  emit('update:isOpen', false);
}

const logout = () => {
  authStore.logout();
  router.replace('/login');
};

onMounted(() => {
  configurarMenu();
});

watch(
  [() => authStore.nameUser, () => authStore.isAdmin, () => route.path],
  () => {
    configurarMenu();
  }
);
</script>