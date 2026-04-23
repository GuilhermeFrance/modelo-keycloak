<template>
  <div>
    <div class="full-width flex flex-col gap-3 mb-4 px-4">
      <div class="flex flex-wrap items-end gap-3 w-full">
        
        <div class="flex flex-wrap items-end gap-3 min-w-0 flex-1">
          
          <div
            v-for="filterOption in filters"
            :key="filterOption.label"
            class="flex flex-col min-w-[120px] flex-1"
          >
            <label class="text-xs font-semibold text-slate-500 uppercase mb-1 block">
              {{ filterOption.label }}
            </label>

            <q-select
              borderless
              dense
              v-model="filterOption.model"
              :options="filterOption.options"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              color="primary"
              clearable
              clear-icon="close"
              @update:model-value="val => filterOption.actions && filterOption.actions(val)"
              class="w-full min-h-9 bg-pmvc-input rounded-lg px-2 border border-gray-200 focus-within:ring-1 focus-within:ring-pmvc-blue/20 transition-all text-sm"
            />
          </div>

          <div class="flex flex-col min-w-[200px] flex-1">
            <label class="text-xs font-semibold text-slate-500 uppercase mb-1 block">
              Pesquisar
            </label>
            <div class="flex items-center gap-2">
              <q-input
                v-model="filter"
                borderless
                dense
                debounce="500"
                placeholder="Pesquisar..."
                @update:model-value="findInfomaion"
                ref="searchInput"
                class="flex-1 min-w-0 bg-pmvc-input rounded-lg px-3 border border-gray-200 focus-within:border-pmvc-blue focus-within:ring-1 focus-within:ring-pmvc-blue/20 transition-all placeholder-pmvc-gray"
              >
                <template v-slot:prepend>
                  <q-icon
                    name="search"
                    class="text-pmvc-gray cursor-pointer"
                    @click="focusSearchInput"
                  />
                </template>
              </q-input>
              
              <q-btn
                :disable="checkFilter"
                flat
                dense
                icon="filter_alt_off"
                size="md"
                title="Limpar filtros"
                :color="checkFilter ? 'grey-5' : 'red-5'"
                class="rounded-lg border border-gray-200 flex-shrink-0"
                @click="clearAllFilters"
              />
            </div>
          </div>

          <q-btn
            v-if="showAddButton"
            color="pmvc-blue"
            :label="titleButtonAdd"
            @click="router.push(routeAdd)"
            no-caps
            icon="add"
            unelevated
            class="rounded-md py-1.5 px-3 font-medium shadow-sm transition-shadow duration-200 hover:shadow-md flex-shrink-0 [&_.q-icon]:mr-1.5"
          />
        </div>
      </div>
    </div>

    <q-table
      ref="tableRef"
      :rows="rows"
      :columns="column"
      :row-key="rowKey"
      v-model="pagination_initial"
      flat
      hide-pagination
      :sort-method="customSort"
      binary-state-sort
      class="shadow-none text-pmvc-gray bg-white border border-slate-200 rounded-lg table-list-table"
    >

      <template v-slot:header="props">
        <q-tr
          :props="props"
          class="bg-pmvc-input text-xs uppercase tracking-wider text-pmvc-gray font-bold border-b border-gray-200"
        >
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-left py-4"
            :class="[
              ['acao', 'acoes'].includes(col.name)
                ? 'sticky right-0 bg-pmvc-input z-10'
                : '',
              col.sortable !== false ? 'cursor-pointer select-none' : '',
              col.classes || '',
            ].filter(Boolean).join(' ')"
            :style="
              ['acao', 'acoes'].includes(col.name)
                ? `position: sticky; right: 0; z-index: 10; ${
                    !isScrolledRight
                      ? 'box-shadow: -4px 0 8px -4px rgba(0, 0, 0, 0.1);'
                      : ''
                  }`
                : ''
            "
            @click="col.sortable !== false && onSort(col)"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body-cell-nivel="props">
        <q-td :props="props">
          {{ formatNivel(props.value) }}
        </q-td>
      </template>

      <template v-slot:body-cell-situacao="props">
        <q-td :props="props">
          <q-badge
            :color="defineColor(props.value)"
            :label="formatLabel(props.value)"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-acoes="scope">
        <q-td
          :props="scope"
          class="bg-white"
          :style="`position: sticky; right: 0; z-index: 10; ${
            !isScrolledRight
              ? 'box-shadow: -4px 0 8px -4px rgba(0, 0, 0, 0.1);'
              : ''
          }`"
        >
          <div class="flex justify-center flex-nowrap text-center q-px-sm">
            <q-btn
              v-for="acao in acoesVisiveis"
              :key="acao.label"
              :icon="acao.icon"
              :color="acao.color"
              :class="acaoHoverClass(acao.color)"
              size="md"
              dense
              flat
              round
              :title="acao.label"
              @click="acao.action(scope.row)"
            >
              <q-tooltip
                class="bg-gray-800 text-white font-bold"
                anchor="bottom middle"
                self="top middle"
              >
                {{ acao.label }}
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <template v-slot:no-data>
        <div class="full-width flex flex-center py-5">
          <div class="text-center">
            <div class="mx-auto mb-4 w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
              <q-icon name="search_off" size="40px" class="text-slate-300" />
            </div>
            <p class="text-lg font-semibold text-slate-400 mb-1">
              Nenhum registro encontrado
            </p>
            <p class="text-sm text-slate-400">
              Ajuste os filtros ou tente novamente
            </p>
          </div>
        </div>
      </template>
    </q-table>

    <div class="flex justify-center mt-6 table-list-pagination">
      <q-pagination
        v-model="pagination_initial.page"
        @update:model-value="findInfomaion"
        :max="Number(maxPages)"
        direction-links
        color="grey-10"
        active-color="primary"
        active-text-color="white"
        rounded
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const tableRef = ref(null);
const isScrolledRight = ref(true);
let resizeObserver = null;

const emits = defineEmits(['getUsers', 'clearFilters']);

const props = defineProps({
  title: String,
  filters: { type: Array, default: () => [] },
  acoes: { type: Array, default: () => [] },
  column: { type: Array, required: true },
  rows: { type: Array, required: true },
  titleButtonAdd: { type: String, default: 'Adicionar' },
  routeAdd: String,
  itemsPerPage: { type: Number, default: 10 },
  maxPages: { type: Number, default: 0 },
  rowKey: { type: String, default: 'id' },
  showAddButton: { type: Boolean, default: true }
});

const searchInput = ref(null);
const filter = ref('');

const pagination_initial = ref({
  sortBy: 'nome',
  descending: false,
  page: 1,
  rowsPerPage: props.itemsPerPage,
  rowsNumber: 0,
});

const focusSearchInput = () => {
  searchInput.value?.focus();
};

const handleScroll = (e) => {
  const { scrollWidth, clientWidth, scrollLeft } = e.target;
  isScrolledRight.value = Math.ceil(scrollLeft + clientWidth) >= scrollWidth;
};

onMounted(() => {
  setTimeout(() => {
    const tableContainer = tableRef.value?.$el?.querySelector('.q-table__middle');
    if (tableContainer) {
      tableContainer.addEventListener('scroll', handleScroll);
      resizeObserver = new ResizeObserver(() => handleScroll({ target: tableContainer }));
      resizeObserver.observe(tableContainer);
      handleScroll({ target: tableContainer });
    }
  }, 300);
});

onBeforeUnmount(() => {
  const tableContainer = tableRef.value?.$el?.querySelector('.q-table__middle');
  tableContainer?.removeEventListener('scroll', handleScroll);
  resizeObserver?.disconnect();
});

const checkFilter = computed(() => {
  const hasSearch = filter.value !== '';
  const hasFilterValues = props.filters.some((f) => f.model);
  return !hasSearch && !hasFilterValues;
});

const acoesVisiveis = computed(() =>
  (props.acoes || []).filter((a) => a.administrator)
);

function clearAllFilters() {
  filter.value = '';
  pagination_initial.value.page = 1;
  props.filters.forEach((f) => (f.model = ''));
  emits('clearFilters');
}

function findInfomaion() {
  emits('getUsers', filter.value, pagination_initial.value.page);
}

function onSort(col) {
  const isSame = pagination_initial.value.sortBy === col.name;
  pagination_initial.value.descending = isSame
    ? !pagination_initial.value.descending
    : false;

  pagination_initial.value.sortBy = col.name;
  pagination_initial.value.page = 1;
  findInfomaion();
}

function customSort(rows) {
  return rows;
}

const acaoHoverClass = (color) => {
  const map = {
    primary: 'text-pmvc-blue hover:bg-blue-50',
    negative: 'text-red-600 hover:bg-red-50',
    positive: 'text-green-600 hover:bg-green-50',
    warning: 'text-amber-600 hover:bg-amber-50',
  };
  return map[color] || 'text-pmvc-blue hover:bg-blue-50';
};

const formatNivel = (v) => {
  const map = {
    ADMIN: 'Administrador',
    USUARIO: 'Usuário',
  };
  return map[v] || v;
};

const formatLabel = (v) =>
  v ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : '';

const defineColor = (v) => ({
  ATIVO: 'green-7',
  INATIVO: 'red-10'
}[v] || 'grey');
</script>

<style scoped>
.table-list-pagination :deep(.q-pagination .q-btn.bg-primary) {
  @apply rounded-full min-w-[2.285714em] min-h-[2.285714em];
}
</style>