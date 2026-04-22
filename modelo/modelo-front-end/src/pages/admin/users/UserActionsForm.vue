<template>
  <q-page>
    <CtiCard :title="define_title" iconName="person_add">
      <FormUser
        :userId="id ? id : null"
        :administrator=administrador
        :labelButtonSave="id ? 'Atualizar' : 'Cadastrar'"
        :showBackButton="true"
        @submitData="submitData"
      />
    </CtiCard>
  </q-page>
</template>

<script setup>
import CtiCard from 'src/components/common/CtiCard.vue';
import FormUser from 'src/components/forms/FormUser.vue';
import showNotification from '../../../utils/quasarPlugins/notifyMessage';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import keycloak from 'src/plugins/keycloak';

const administrador = keycloak.hasRealmRole('admin') || keycloak.hasResourceRole('admin', keycloak.clientId)

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const { id } = route.params;
const subAlvo = ref('');
const loginAtual = ref('');
const define_title = computed(() => {
  if (id) {
    return 'Editar Usuário';
  }
  return 'Adicionar Usuário';
});

onMounted(async () => {
  if (id) {
    try {
      const { data } = await api.get(`usuarios/${id}`);
      subAlvo.value = data.sub || '';
      loginAtual.value = data.login || '';
    } catch (_) {}
  }
});

async function createUser(data) {
  $q.loading.show({
    message: 'Enviando informações ao servidor...',
  });
  try {
    const { status } = await api.post('usuarios', data);
    if (status == 201) {
      showNotification('positive', 'Usuário cadastrado com sucesso!', 'top');
      router.push('/usuarios');
    }
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    showNotification('negative', error.response.data.message, 'top');
  }
}

async function updateUser(dados) {
  $q.loading.show({
    message: 'Enviando informações ao servidor...',
  });
  try {
    const data = { ...dados };
    const novoLogin = (data.login || '').trim();

    if (data.senha === '') {
      delete data.senha;
    }

    // Converte valores de exibição → enum do banco
    if (data.nivel === 'Administrador') data.nivel = 'ADMIN';
    else if (data.nivel === 'Usuário') data.nivel = 'USUARIO';

    if (data.situacao === 'Ativo') data.situacao = 'ATIVO';
    else if (data.situacao === 'Inativo') data.situacao = 'INATIVO';

    // Atualiza login no Keycloak primeiro se mudou
    if (novoLogin && novoLogin !== loginAtual.value && subAlvo.value) {
      await api.patch(`usuarios/${subAlvo.value}/login`, { login: novoLogin });
      loginAtual.value = novoLogin;
    }

    delete data.login;

    const { status } = await api.put(`usuarios/${id}`, data);
    if (status == 200) {
      showNotification('positive', 'Usuário atualizado com sucesso!', 'top');
      router.push('/usuarios');
    }
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    showNotification('negative', error.response.data.message, 'top');
  }
}

async function submitData(data) {
  if (id) {
    updateUser(data);
  } else {
    createUser(data);
  }
}
</script>
