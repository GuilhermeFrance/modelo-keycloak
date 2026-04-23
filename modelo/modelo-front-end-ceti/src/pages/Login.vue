<template>
  <div class="min-h-screen flex items-center justify-center bg-pmvc-bg relative overflow-hidden font-sans">
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none pattern-grid"></div>

    <div class="absolute top-[-15%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-pmvc-lightBlue rounded-full filter blur-[100px] sm:blur-[140px] opacity-[0.12] -pulse-slow"></div>
    <div class="absolute bottom-[-15%] left-[-10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-pmvc-blue rounded-full filter blur-[100px] sm:blur-[140px] opacity-[0.08] -pulse-slow"></div>

    <div class="w-full max-w-[460px] p-4 z-10">
      <div class="text-center mb-8 sm:mb-10 animate-fade-in-down">
        <img
          src="~assets/images/brasao-pmvc-2025.png"
          alt="Brasão PMVC"
          class="h-20 sm:h-22 mx-auto drop-shadow-lg mb-3 sm:mb-5 hover:scale-105 transition-transform duration-500"
        />
        <h1 class="text-pmvc-dark !text-2xl sm:!text-[26px] uppercase !font-bold !tracking-tight">
          {{ app_name }}
        </h1>
        <div class="flex items-center justify-center gap-2 mt-3">
          <div class="h-[1px] w-6 sm:w-10 bg-pmvc-blue/30"></div>
          <span class="text-pmvc-gray text-xs sm:text-[12px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.2em]">
            Modelo do Ceti
          </span>
          <div class="h-[1px] w-6 sm:w-10 bg-pmvc-blue/30"></div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-xl shadow-pmvc-blue/10 border border-gray-100 overflow-hidden animate-fade-in-up">
        <div class="h-1.5 w-full bg-gradient-to-r from-pmvc-lightBlue via-pmvc-blue to-pmvc-blue"></div>

        <div class="p-6 sm:p-10">
          <q-form ref="form" @submit.prevent.stop="login" class="flex flex-col gap-6">
            <div>
              <label class="block text-xs sm:text-sm font-bold text-pmvc-gray uppercase mb-1 sm:mb-2 pl-1">
                Usuário do Sistema
              </label>
              <q-input
                outlined
                dense
                v-model="data.login"
                placeholder="ex: nome.sobrenome"
                bg-color="white"
                class="admin-input text-sm sm:text-base"
                :rules="[(val) => !!val || 'Campo obrigatório']"
                lazy-rules
                hide-bottom-space
              >
                <template v-slot:prepend>
                  <q-icon name="admin_panel_settings" class="text-pmvc-blue" size="20px" sm:size="24px" />
                </template>
              </q-input>
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-bold text-pmvc-gray uppercase mb-1 sm:mb-2 pl-1">
                Senha de Acesso
              </label>
              <q-input
                outlined
                dense
                v-model="data.senha"
                :type="isPwdVisible ? 'text' : 'password'"
                placeholder="Insira sua senha"
                bg-color="white"
                class="admin-input text-sm sm:text-base"
                :rules="[(val) => !!val || 'Campo obrigatório']"
                lazy-rules
                hide-bottom-space
              >
                <template v-slot:prepend>
                  <q-icon name="vpn_key" class="text-pmvc-blue" size="20px" sm:size="24px" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwdVisible ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer text-pmvc-gray hover:text-pmvc-blue transition-colors"
                    @click="isPwdVisible = !isPwdVisible"
                    size="20px" sm:size="24px"
                  />
                </template>
              </q-input>
            </div>

          <q-btn
            type="submit"
            label="ENTRAR"
            :loading="loading"
            size="lg"
            class="w-full !py-3 sm:!py-4 !text-sm !font-bold text-white !bg-pmvc-blue hover:!bg-pmvc-lightBlue shadow-lg shadow-pmvc-blue/25 hover:shadow-pmvc-blue/40 transition-all duration-300 active:scale-[0.99]"
            unelevated
            no-caps
            style="border-radius: 0.5rem"
          >
            <template v-slot:loading>
              <q-spinner-dots class="on-left" />
              Verificando...
            </template>
          </q-btn>
          </q-form>
        </div>

        <div class="bg-pmvc-bg border-t border-gray-100 py-3 text-center">
          <p class="text-[10px] sm:text-[11px] text-pmvc-gray flex items-center justify-center gap-1 px-2">
            <q-icon name="lock" size="12px" sm:size="14px" />
            Ambiente Seguro & monitorado por CETI
          </p>
        </div>
      </div>

      <div class="mt-6 sm:mt-8 text-center opacity-50 hover:opacity-80 transition-opacity">
        <p class="text-xs sm:text-sm text-pmvc-gray">
          © {{ new Date().getFullYear() }} Prefeitura Municipal de Vitória da Conquista
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/authStore';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const app_name = process.env.APP_NAME;

const isPwdVisible = ref(false);
const loading = ref(false)

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/');
  }
});

const data = ref({
  login: '',
  senha: '',
});

async function login() {
  loading.value = true; 
  try {
    await authStore.doLogin(data.value);
    const toPath = route.query.to || '/';
    router.push(toPath);
  } catch (error) {
    console.error('Erro no login:', error);
  } finally {
    loading.value = false; 
  }
}
</script>

<style lang="scss" scoped>
.pattern-grid {
  background-image: radial-gradient(#1660ab 0.8px, transparent 0.8px);
  background-size: 28px 28px;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.08; }
  50% { opacity: 0.15; }
}
.-pulse-slow {
  animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

:deep(.admin-input .q-field__control) {
  border-radius: 0.5rem;
  border-color: #e5e7eb;
  transition: all 0.2s ease;
}

:deep(.admin-input .q-field__control:hover) {
  border-color: #2b7bc9;
}

:deep(.admin-input.q-field--focused .q-field__control) {
  border-color: #1660ab !important;
  box-shadow: 0 0 0 3px rgba(22, 96, 171, 0.12);
}
</style>
