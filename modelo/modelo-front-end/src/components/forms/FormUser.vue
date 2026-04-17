<template>
  <q-form @submit.prevent.stop="sendData" greedy>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
        <q-input
          dense
          outlined
          v-model="form.nome"
          lazy-rules
          label="Nome"
          hint="Informe o nome completo sem
          abreviações"
          clearable
          clear-icon="close"
          :rules="nameRules"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
        <q-input
          dense
          outlined
          v-model="form.email"
          lazy-rules
          label="Email"
          hint="Informe o email"
          clearable
          clear-icon="close"
          :rules="emailRules"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
        <q-select
          :disable="!administrator"
          outlined
          dense
          v-model="form.nivel"
          :options="level_access_options"
          lazy-rules
          label="Nível"
          hint="Informe o nível de acesso"
          clearable
          clear-icon="close"
          :rules="empty_field_rules"
          behavior="menu"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
        <q-select
          :disable="!administrator"
          dense
          outlined
          v-model="form.situacao"
          :options="situation_options"
          lazy-rules
          label="Situação"
          hint="Informe a situação"
          clearable
          clear-icon="close"
          :rules="empty_field_rules"
          behavior="menu"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
        <q-input
          :disable="!administrator"
          dense
          outlined
          v-model="form.login"
          lazy-rules
          label="Login"
          hint="Informe o nome para login"
          clearable
          clear-icon="close"
          :rules="loginRules"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
        <q-input
          type="password"
          dense
          outlined
          v-model="form.senha"
          lazy-rules
          label="Senha"
          hint="Informe uma senha"
          clear-icon="close"
          :rules="password_rules"
          autocomplete="new-password"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
        <q-input
          dense
          outlined
          v-model="password_confirmation"
          lazy-rules
          label="Confirmação da senha"
          hint="Informe novamente a senha"
          type="password"
          clear-icon="close"
          :rules="rules_confirm_password"
        />
      </div>
    </div>

    <div class="row justify-end q-mt-lg flex">
      <q-btn
        class="q-py-sm text-size"
        :style="{ width: $q.screen.xs ? '100%' : 'auto' }"
        icon="save"
        :label="labelButtonSave"
        type="submit"
        color="primary"
      />

      <q-btn
        class="q-py-sm text-size"
        :style="{
          width: $q.screen.xs ? '100%' : 'auto',
          margin: $q.screen.xs ? '20px 0 0 0' : '0 0 0 20px',
        }"
        v-if="showBackButton"
        icon="close"
        label="Cancelar"
        color="grey-2"
        text-color="grey-10"
        to="/usuarios"
      />
    </div>
  </q-form>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const emits = defineEmits(['submitData']);

const form = ref({
  nome: '',
  email: '',
  nivel: '',
  situacao: '',
  login: '',
  senha: '',
});

const props = defineProps({
  userId: {
    type: String,
    default: '',
  },
  administrator: {
    type: Boolean,
    default: false,
  },
  labelButtonSave: {
    type: String,
    default: 'Salvar',
  },
  showBackButton: {
    type: Boolean,
    default: false,
  },
});

const password_confirmation = ref('');
const level_access_options = ref(['Usuário', 'Administrador']);
const situation_options = ref(['Ativo', 'Inativo']);
const empty_field_rules = [(val) => !!val || '*Campo obrigatório'];

function validateName(val) {
  const regex = /[!@#$%*()_+=-?°``''~©,.;<>:]|[0-9]/g;

  return !regex.test(val);
}

function validateEmail(val) {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(val);
}

function validateLogin(val) {
  const regex = /[^a-zA-Zs]/g;

  return !regex.test(val);
}

function validatePassword() {
  if (!!props.userId) return true;

  return !!form.value.senha.length;
}

function validatePasswordConfirmation() {
  if (!!props.userId && form.value.senha.length == 0) return true;

  const equal_values = form.value.senha === password_confirmation.value;
  if (equal_values) return true;
}

const nameRules = [
  (val) => !!val || '*Campo obrigatório',
  (val) =>
    validateName(val) ||
    "*Proibido o uso dos seguintes caracteres [!@#$%*()_+=-?°``''~©,.;<>:], valores numéricos ou espaços",
];

const emailRules = [
  (val) => !!val || '*Campo obrigatório',
  (val) => validateEmail(val) || '*Formato de email inválido',
];

const loginRules = [
  (val) => !!val || '*Campo obrigatório',
  (val) =>
    validateLogin(val) ||
    "*Proibido o uso dos seguintes caracteres [!@#$%*()_+=-?°``''~©,.;<>:], valores numéricos ou espaços",
];

const password_rules = [() => validatePassword() || '*Campo obrigatório'];

const rules_confirm_password = [
  () =>
    validatePasswordConfirmation() || '*As senhas fornecidas não são iguais.',
];

async function findUser(id) {
  const { data } = await api.get(`usuarios/${id}`);

  return data;
}

function fillInFields(data) {
  form.value.nome = data.nome;
  form.value.email = data.email;
  form.value.nivel = data.nivel;
  form.value.situacao = data.situacao;
  form.value.login = data.login;
}

function sendData() {
  emits('submitData', form.value);
}

onMounted(async () => {
  if (props.userId) {
    const data = await findUser(props.userId);

    fillInFields(data);
  }
});
</script>

<style scoped>
.text-size {
  font-size: 1rem !important;
}
</style>
