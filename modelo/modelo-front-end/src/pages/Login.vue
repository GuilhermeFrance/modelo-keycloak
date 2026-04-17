<template>
  <main class="row justify-center">
    <div class="col-xs-12 col-md-6">
      <div class="row text-center q-mt-xl">
        <div class="col-xs-11 col-12 flex justify-center items-center">
          <img
            class="pmvc-logo"
            src="../assets/images/logo-pmvc.png"
            alt="Logo da PMVC"
          />
        </div>
        <div class="col-xs-11 col-12 flex justify-center items-center">
          <q-icon name="apps" class="" size="lg" color="blue-9" />
          <h1 class="text-bold text-blue-9 text-h4 q-ml-md">
            {{ app_name }}
          </h1>
        </div>
      </div>
      <div class="row justify-center">
        <q-form ref="form" @submit.prevent.stop="login">
          <div class="row q-py-lg">
            <div class="col-xs-10 col-12 q-mb-md">
              <label class="label text-font">Usuário</label>
              <q-input
                filled
                ref="login"
                outlined
                name="usuario"
                type="text"
                v-model="data.login"
                lazy-rules
                :rules="usernameRules"
              />
            </div>
            <div class="col-12 q-mb-md">
              <label class="label text-font">Senha</label>
              <q-input
                filled
                ref="password"
                outlined
                name="password"
                type="password"
                v-model="data.senha"
                :rules="passwordRules"
                autocomplete="off"
              />
            </div>
            <div class="col-12">
              <q-btn
                class="text-font full-width"
                type="submit"
                color="primary"
                label="Entrar"
              />
            </div>
          </div>
        </q-form>
      </div>
      <div class="cti-logo-container flex justify-center items-center">
        <img
          class="cti-logo"
          src="../assets/images/cti-logo2.png"
          alt="cti logo"
        />
      </div>
    </div>
    <div class="aside col-xs-0 col-md-6 column justify-end">
      <img
        src="../assets/images/logo_CTI.png"
        alt="logo do cti"
        style="width: 500px; margin: 10px auto"
      />
    </div>
  </main>
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

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/');
  }
});

const data = ref({
  login: '',
  senha: '',
});

const usernameRules = [
  (val) => (val && val.length > 0) || 'Digite o seu nome de usuário',
  (val) =>
    validateName(val) ||
    "*Proibido o uso dos seguintes caracteres [!@#$%*()_+=-?°``''~©,.;<>:], valores numéricos ou espaços",
];

const passwordRules = [
  (val) => (val && val.length > 0) || 'Digite a sua senha',
];

function validateName(name) {
  const regexText = /[^a-zA-Zs]/g;
  return !regexText.test(name);
}

async function login() {
  try {
    await authStore.doLogin(data.value);
    const toPath = route.query.to || '/';
    router.push(toPath);
  } catch (error) {
    console.error('Erro no login:', error);
  }
}
</script>

<style scoped>
.pmvc-logo {
  height: 8.2rem;
  object-fit: cover;
}

.aside {
  background: linear-gradient(
      to bottom,
      rgba(50, 113, 166, 0.85),
      rgba(183, 215, 86, 0.85)
    ),
    url(../assets/images/imagem-de-fundo.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  height: 100vh;
}

.text-font {
  font-family: 'Gothic A1', sans-serif;
}

.label {
  font-size: 1.2rem;
}

.cti-logo-container {
  display: none;
}
.cti-logo {
  height: 7.5rem;
  object-fit: cover;
}

@media (max-width: 1024px) {
  .aside {
    display: none;
  }
  .cti-logo-container {
    width: 100%;
    display: flex;
    margin-top: 1rem;
  }
}
</style>
