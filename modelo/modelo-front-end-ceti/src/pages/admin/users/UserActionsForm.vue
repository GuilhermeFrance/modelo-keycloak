<template>
 <q-page padding class="max-w-9xl animate-fade-in-down">
    <CetiCard :title="define_title" iconName="person_add">
      <FormUser
        :userId="id ? id : null"
        :administrator="level_access === 'ADMIN' ? true : false"
        :labelButtonSave="id ? 'Atualizar' : 'Cadastrar'"
        :showBackButton="true"
        @submitData="submitData"
      />
    </CetiCard>
  </q-page>
</template>

<script setup>
import CetiCard from 'src/components/common/CetiCard.vue';
import FormUser from 'src/components/forms/FormUser.vue';
import showNotification from '../../../utils/quasarPlugins/notifyMessage';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const level_access = sessionStorage.getItem('access_level');
const { id } = route.params;
const define_title = computed(() => {
  if (id) {
    return 'Editar Usuário';
  }
  return 'Adicionar Usuário';
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

async function updateUser(data) {
  $q.loading.show({
    message: 'Enviando informações ao servidor...',
  });
  try {
    if (data.senha === '') {
      delete data.senha;
    }
    const { status } = await api.patch(`usuarios/${id}`, data);
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
