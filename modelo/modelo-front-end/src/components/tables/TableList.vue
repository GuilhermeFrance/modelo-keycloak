<template>
  <q-table
    :rows="rows"
    :columns="column"
    row-key="name"
    v-model:pagination="pagination_initial"
  >
    <template v-slot:top>
      <div class="full-width row flex justify-between items-center">
        <div
          class="col-xs-12 col-sm-5 col-md-3 col-lg-2 col-xl-2"
          :style="{
            margin: $q.screen.xs || $q.screen.sm ? '0 0 10px 0' : '0 0 0 0',
          }"
        >
          <q-btn
            color="primary"
            :label="titleButtonAdd"
            @click="router.push(routeAdd)"
            no-caps
            icon="add"
            unelevated
            dense
          />
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-4"
          :style="{
            margin: $q.screen.xs || $q.screen.sm ? '0 0 10px 0' : '0 0 0 0',
          }"
        >
          <div class="row full-width justify-between">
            <div
              class="col-xs-6"
              v-for="filterOption in filters"
              :key="filterOption.label"
            >
              <q-select
                filled
                dense
                v-model:model-value="filterOption.model"
                :options="filterOption.options"
                :label="filterOption.label"
                @update:model-value="filterOption.actions"
                :class="
                  (filterOption.model !== '' ? 'bg-blue-grey-2' : 'bg-grey-2',
                  'styleCard')
                "
                color="blue-10"
                style="border-radius: 5px; margin-right: 10px"
              />
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-5 col-xl-4">
          <div class="full-width row flex items-center justify-between">
            <div class="col-xs-11 col-sm-11 col-md-11 col-lg-11 col-xl-11">
              <q-input
                v-model="filter"
                debounce="500"
                placeholder="Pesquisar"
                dense
                filled
                @update:model-value="findInfomaion"
                ref="searchInput"
              >
                <template v-slot:prepend>
                  <q-icon
                    name="search"
                    style="color: #a2a2a2"
                    @click="focusSearchInput"
                  />
                </template>
              </q-input>
            </div>
            <div
              class="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 flex justify-center"
            >
              <q-btn
                :disable="checkFilter"
                flat
                dense
                size="md"
                title="Limpar filtros"
                color="grey-"
                @click="clearAllFilters"
              >
                <q-img src="/images/vassoura.png" width="20px" />
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:body-cell-situacao="props">
      <q-td :props="props">
        <div>
          <q-badge :color="defineColor(props.value)" :label="props.value" />
        </div>
      </q-td>
    </template>

    <template v-slot:body-cell-acoes="scope">
      <q-td
        class="row flex justify-center items-center q-pa-md q-gutter-x-sm text-center"
      >
        <div
          class="col-2 flex justify-center items-center text-center"
          v-for="acao in acoes"
          :key="acao.name"
        >
          <q-btn
            :title="acao.label"
            dense
            unelevated
            v-if="acao.administrator"
            :color="acao.color"
            :icon="acao.icon"
            @click="acao.action(scope.row)"
            size="sm"
          />
        </div>
      </q-td>
    </template>
    <template v-slot:bottom>
      <div class="full-width row justify-center q-mt-md">
        <q-pagination
          v-model="pagination_initial.page"
          @update:model-value="findInfomaion"
          color="info"
          active-color="primary"
          :max="maxPages"
          :max-pages="5"
          direction-links
          size="md"
        />
      </div>
    </template>
  </q-table>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const router = useRouter();

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'Título da tabela',
  },
  filters: {
    type: Array,
    required: false,
    default: () => [],
  },
  acoes: {
    type: Array,
    required: false,
    default: () => [],
  },
  column: {
    type: Array,
    required: true,
    default: () => [],
  },
  rows: {
    type: Array,
    required: true,
    default: () => [],
  },
  actions: {
    type: Array,
    required: false,
    default: () => [],
  },
  titleButtonAdd: {
    type: String,
    required: false,
    default: 'Adicionar',
  },
  routeAdd: {
    type: String,
    required: false,
    default: '',
  },
  itemsPerPage: {
    type: Number,
    required: false,
    default: 10,
  },
  maxPages: {
    type: Number,
    required: false,
    default: 0,
  },
});

//referencia para o input de pesquisa
const searchInput = ref(null);
const focusSearchInput = () => {
  searchInput.value.focus();
};

//paginação
const filter = ref('');
const pagination_initial = ref({
  sortBy: 'nome',
  descending: false,
  page: 1,
  rowsPerPage: props.itemsPerPage,
  rowsNumber: 0,
});

const checkFilter = computed(() => {
  if (
    filter.value !== '' ||
    props.filters.some((filter) => filter.model !== '')
  ) {
    return false;
  } else {
    return true;
  }
});

function clearAllFilters() {
  filter.value = '';
  pagination_initial.value.page = 1;
  props.filters.forEach((filter) => {
    filter.model = '';
  });
  emits('clearFilters');
}

const emits = defineEmits(['getUsers', 'clearFilters']);

function findInfomaion() {
  emits('getUsers', filter.value, pagination_initial.value.page);
}

//mudar cores de acordo com status ou situacao
const defineColor = (situacao) => {
  const coresPorSituacao = {
    //adicione aqui todas as cores e situações que desejar
    Ativo: 'teal-9',
    Inativo: 'red-10',
  };

  const corPadrao = 'grey';

  return coresPorSituacao[situacao] || corPadrao;
};
</script>

<style scoped></style>
