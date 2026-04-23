<template>
  <q-page padding class="max-w-9xl animate-fade-in-down">
    <CetiCard icon="people" title="Usuários do Sistema">
      <TableList
        title="Lista de usuários"
        :column="columns"
        :rows="rows"
        :acoes="acoes"
        routeAdd="/usuarios/adicionar"
        titleButtonAdd="Adicionar Usuário"
        @getUsers="getUsers"
        :itemsPerPage="10"
        :maxPages="max_pages"
        :filters="filters"
        @clearFilters="clearFilters"
      >
      </TableList>
    </CetiCard>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { api } from 'src/boot/axios';
import showNotification from 'src/utils/quasarPlugins/notifyMessage';
import CetiCard from '../../../components/common/CetiCard.vue';
import TableList from 'src/components/tables/TableList.vue';
import showModal from 'src/utils/quasarPlugins/dialogMessage';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const level_access = sessionStorage.getItem('access_level');
const $q = useQuasar();
const max_pages = ref(0);
const router = useRouter();

const modelsFilters = ref({
  nivel: '',
  situacao: '',
});

const filters = ref([
  {
    label: 'Nível',
    model: modelsFilters.value.nivel,
    options: [
      { label: 'Todos', value: '' },
      { label: 'Administrador', value: 'ADMIN' },
      { label: 'Usuário', value: 'USUARIO' },
    ],
    actions: (val) => {
      modelsFilters.value.nivel = val || ''; 
      getUsers();
    },
  },
  {
    label: 'Situação',
    model: modelsFilters.value.situacao,
    options: [
      { label: 'Todos', value: '' },
      { label: 'Ativo', value: 'ATIVO' },
      { label: 'Inativo', value: 'INATIVO' },
    ],
    actions: (val) => {
      modelsFilters.value.situacao = val || '';
      getUsers();
    },
  },
]);

const acoes = ref([
  {
    label: 'Editar',
    icon: 'edit',
    color: 'primary',
    administrator: true,
    action: (row) => {
      router.push(`/usuarios/editar/${row.id}`);
    },
  },
  {
    label: 'Excluir',
    icon: 'delete',
    color: 'negative',
    administrator: level_access === 'ADMIN' ? true : false,
    action: (row) => {
      deleteUser(row);
    },
  },
]);

const columns = ref([
  {
    name: 'nome',
    required: true,
    label: 'Nome',
    align: 'left',
    field: 'nome',
    sortable: true,
  },
  {
    name: 'login',
    align: 'center',
    label: 'Login',
    field: 'login',
    sortable: true,
  },
  {
    name: 'nivel',
    align: 'center',
    label: 'Nível',
    field: 'nivel',
    sortable: true,
  },
  {
    name: 'situacao',
    align: 'center',
    label: 'Situação',
    field: 'situacao',
    sortable: true,
  },
  {
    name: 'acoes',
    field: 'acoes',
    align: 'center',
    label: 'Ações',
    sortable: true,
  },
]);
const rows = ref([]);

onMounted(() => {
  getUsers();
});

async function getUsers(pesquisa = '', page) {
  $q.loading.show({
    message: 'Buscando informações no servidor...',
  });

  rows.value = [];

  const filtros = {
    nivel: modelsFilters.value.nivel,
    situacao: modelsFilters.value.situacao,
  };

  try {
    let url = `usuarios?pagina=${page || 1}&itensPorPagina=10&busca=${pesquisa}`;

    const filtrosAtivos = [];
    const valoresAtivos = [];

    if (filtros.nivel) {
      filtrosAtivos.push('nivel');
      valoresAtivos.push(filtros.nivel);
    }

    if (filtros.situacao) {
      filtrosAtivos.push('situacao');
      valoresAtivos.push(filtros.situacao);
    }

    if (filtrosAtivos.length > 0) {
      url += `&filtro=${filtrosAtivos.join(',')}&valor=${valoresAtivos.join(',')}`;
    }

    const { data } = await api.get(url);

    rows.value = data.data;
    max_pages.value = data.maxPag;
  } finally {
    $q.loading.hide();
  }
}

async function clearFilters() {
  modelsFilters.value.nivel = '';
  modelsFilters.value.situacao = '';
  await getUsers();
}

async function deleteUser(user) {
  showModal(`Tem certeza que deseja excluir o usuário`, user.nome).onOk(
    async () => {
      $q.loading.show({
        message: 'Aguarde, excluindo usuário...',
        spinnerColor: 'blue-5',
      });
      try {
        const { status } = await api.delete(`usuarios/${user.id}`);
        if (status == 200) {
          showNotification(
            'positive',
            'Usuário removido com sucesso!',
            'top',
            3000,
          );
        }
        getUsers();
        $q.loading.hide();
      } catch (error) {
        showNotification('negative', error.response.data.message, 'top', 3000);
        $q.loading.hide();
      }
    },
  );
}
</script>

<style scoped></style>
