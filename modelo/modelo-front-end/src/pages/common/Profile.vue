<template>
  <q-page>
    <CtiCard iconName="manage_accounts" title="Perfil">
      <FormUser
        :userId="id"
        :administrator="administrador"
        enviarBotao="Salvar"
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

const router = useRouter();
const id = window.sessionStorage.getItem('user_id');
const administrador =
  window.sessionStorage.getItem('access_level') === 'Administrador'
    ? true
    : false;

async function updateData(dados) {
  try {
    const data = { ...dados };

    if (data.senha === '') {
      delete data.senha;
    }
    const { status } = await api.put(`usuarios/${id}`, data);

    const define_route = administrador ? '/admin/' : '/usuario/';

    if (status == 200)
      showNotification('positive', 'Usuário atualizado com sucesso!', 'top');
    router.push(define_route);
  } catch (error) {
    showNotification('negative', error.response.data.message, 'top');
  }
}
</script>

<style scoped></style>
