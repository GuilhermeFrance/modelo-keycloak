<template>
  <q-form @submit.prevent.stop="sendData" greedy class="space-y-4">
    <div>
      <h3 class="text-sm font-bold text-slate-400 uppercase mb-2 border-b border-slate-100 pb-2">
        Dados do Usuário
      </h3>
      <div class="row q-col-gutter-sm">
        
        <div class="col-xs-12 col-sm-6">
          <Label required>
            Nome Completo
          </Label>
          <q-input
            dense
            outlined
            v-model="form.nome"
            placeholder="Ex: João da Silva"
            class="bg-white"
            color="blue-grey-10"
            lazy-rules
            clearable
            clear-icon="close"
            :rules="nameRules"
          />
        </div>

        <div class="col-xs-12 col-sm-6">
          <Label required>
            Email
          </Label>
          <q-input
            dense
            outlined
            v-model="form.email"
            placeholder="email@exemplo.com"
            class="bg-white"
            color="blue-grey-10"
            lazy-rules
            clearable
            clear-icon="close"
            :rules="emailRules"
          />
        </div>

        <div class="col-xs-12 col-sm-6">
          <Label required>
            Nível de Acesso
          </Label>
          <q-select
            :disable="!administrator"
            outlined
            dense
            v-model="form.nivel"
            :options="level_access_options"
            map-options
            emit-value
            placeholder="Selecione o nível"
            class="bg-white"
            color="blue-grey-10"
            lazy-rules
            clearable
            clear-icon="close"
            :rules="empty_field_rules"
            behavior="menu"
          />
        </div>

        <div class="col-xs-12 col-sm-6">
          <Label required>
            Situação
          </Label>
          <q-select
            :disable="!administrator"
            dense
            outlined
            v-model="form.situacao"
            :options="situation_options"
            map-options
            emit-value
            placeholder="Status do usuário"
            class="bg-white"
            color="blue-grey-10"
            lazy-rules
            clearable
            clear-icon="close"
            :rules="empty_field_rules"
            behavior="menu"
          />
        </div>

      </div>
    </div>

    <div>
      <h3 class="text-sm font-bold text-slate-400 uppercase mb-2 border-b border-slate-100 pb-2 mt-4">
        Acesso
      </h3>
      <div class="row q-col-gutter-sm">
        
        <div class="col-xs-12 col-sm-4">
          <Label required>
            Login
          </Label>
          <q-input
            :disable="!administrator"
            dense
            outlined
            v-model="form.login"
            placeholder="Usuario.Sistema"
            class="bg-white"
            color="blue-grey-10"
            lazy-rules
            clearable
            clear-icon="close"
            :rules="loginRules"
          />
        </div>

        <div class="col-xs-12 col-sm-4">
          <Label required>
            Senha <span v-if="userId" class="text-[10px] lowercase normal-case">(Deixe em branco p/ manter)</span>
          </Label>
          <q-input
            type="password"
            dense
            outlined
            v-model="form.senha"
            placeholder="********"
            class="bg-white"
            color="blue-grey-10"
            lazy-rules
            clear-icon="close"
            :rules="password_rules"
            autocomplete="new-password"
          />
        </div>

        <div class="col-xs-12 col-sm-4">
          <Label required>
            Confirmar Senha
          </Label>
          <q-input
            dense
            outlined
            v-model="password_confirmation"
            placeholder="********"
            type="password"
            class="bg-white"
            color="blue-grey-10"
            lazy-rules
            clear-icon="close"
            :rules="rules_confirm_password"
          />
        </div>

      </div>
    </div>

    <div class="row justify-end items-center q-gutter-md pt-2 border-t border-slate-100 mt-6">
      <q-btn
        v-if="showBackButton"
        flat
        label="Cancelar"
        color="blue-grey-6"
        to="/usuarios"
        class="font-medium hover:bg-slate-100 px-4 rounded-lg"
        no-caps
      />
      
      <q-btn
        unelevated
        icon="save"
        :label="labelButtonSave"
        type="submit"
        style="background-color: #1660ab; color: white"
        class="px-6 py-2 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
        no-caps
      />
    </div>
  </q-form>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import Label from '../formsCommon/Label.vue';

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
const level_access_options = ref([
  { label: 'Usuário', value: 'USUARIO' },
  { label: 'Administrador', value: 'ADMIN' }
]);
const situation_options = ref([
  { label: 'Ativo', value: 'ATIVO' },
  { label: 'Inativo', value: 'INATIVO' }
]);
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
  if (!!props.userId && form.value.senha.length === 0) return true;
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
  () => validatePasswordConfirmation() || '*As senhas fornecidas não são iguais.',
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
</style>