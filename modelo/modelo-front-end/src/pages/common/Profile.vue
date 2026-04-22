<template>
  <q-page>
    <CtiCard iconName="manage_accounts" title="Perfil">
      <FormUser
        :userId="id"
        :administrator="administrador"
        labelButtonSave="Salvar"
        @submitData="updateData"
      />
    </CtiCard>
  </q-page>
</template>

<script setup>
import CtiCard from 'src/components/common/CtiCard.vue';
import FormUser from 'src/components/forms/FormUser.vue';
import { api } from 'src/boot/axios';
import showNotification from '../../utils/quasarPlugins/notifyMessage.js';
import { useRouter } from 'vue-router';
import keycloak from 'src/plugins/keycloak';
import { onMounted, ref } from 'vue';

const id = ref();
const sub = ref('');
const loginAtual = ref('');
const router = useRouter();

async function getDados() {
  const { data } = await api.get('/usuarios/me');
  id.value = data.id;
  sub.value = data.sub || '';
  loginAtual.value = data.login || '';
}

const administrador =
  keycloak.hasRealmRole('admin') ||
  keycloak.hasResourceRole('admin', keycloak.clientId);

async function updateData(dados) {
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

    // Atualiza login no Keycloak + banco primeiro (antes de alterar os demais dados)
    if (novoLogin && novoLogin !== loginAtual.value) {
      await api.patch(`usuarios/${sub.value}/login`, { login: novoLogin });
      loginAtual.value = novoLogin;
    }

    // Remove login do payload pois a rota /login já cuida disso
    delete data.login;

    const { status } = await api.patch(`usuarios/${id.value}`, data);

    const define_route = administrador ? '/admin/' : '/usuario/';

    if (status == 200)
      showNotification('positive', 'Usuário atualizado com sucesso!', 'top');
    router.push(define_route);
  } catch (error) {
    showNotification('negative', error.response.data.message, 'top');
  }
}

onMounted(getDados);
</script>

<style scoped></style>
