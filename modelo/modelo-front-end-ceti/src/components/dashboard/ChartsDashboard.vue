<template>
  <div class="row q-col-gutter-lg items-stretch">
    
    <div class="col-12 col-md-6 col-lg-4 flex" style="min-width: 0;">
      <q-card class="shadow-sm rounded-2xl bg-white border-none full-height flex-1 column overflow-hidden">
        <q-card-section class="q-pa-lg">
          <h2 class="text-h6 text-weight-bold text-pmvc-dark q-mt-none q-mb-md">
            Distribuição
          </h2>
          <VueApexCharts
            type="donut"
            width="100%"
            height="280"
            :options="pieOptions"
            :series="pieSeries"
          />
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-6 col-lg-8 flex" style="min-width: 0;">
      <q-card class="shadow-sm rounded-2xl bg-white border-none full-height flex-1 column overflow-hidden">
        <q-card-section class="q-pa-lg">
          <h2 class="text-h6 text-weight-bold text-pmvc-dark q-mt-none q-mb-md">
            Crescimento mensal
          </h2>
          <VueApexCharts
            type="area"
            width="100%"
            height="280"
            :options="lineOptions"
            :series="lineSeries"
          />
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-6 col-lg-8 flex" style="min-width: 0;">
      <q-card class="shadow-sm rounded-2xl bg-white border-none full-height flex-1 column overflow-hidden">
        <q-card-section class="q-pa-lg">
          <h2 class="text-h6 text-weight-bold text-pmvc-dark q-mt-none q-mb-md">
            Novos registros nos últimos meses
          </h2>
          <VueApexCharts
            type="bar"
            width="100%"
            height="280"
            :options="barOptions"
            :series="barSeries"
          />
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-6 col-lg-4 flex" style="min-width: 0;">
      <q-card class="shadow-sm rounded-2xl bg-white border-none full-height flex-1 column overflow-hidden">
        <q-card-section class="q-pa-lg">
          <h2 class="text-h6 text-weight-bold text-pmvc-dark q-mt-none q-mb-md">
            Usuários (Ativos vs Inativos)
          </h2>
          <VueApexCharts
            type="donut"
            width="100%"
            height="280"
            :options="activeUsersOptions"
            :series="activeUsersSeries"
          />
        </q-card-section>
      </q-card>
    </div>
    
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const pieSeries = ref([10, 5, 10, 15]);

const pieOptions = ref({
  chart: { redrawOnParentResize: true },
  labels: ['Início', 'Administradores', 'Usuários', 'Favoritos'],
  legend: { position: 'bottom' },
  dataLabels: { enabled: false },
  colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
});

const lineSeries = ref([
  {
    name: 'Evolução',
    data: [2, 4, 6, 8, 12, 15],
  },
]);

const lineOptions = ref({
  chart: {
    toolbar: { show: false },
    parentHeightOffset: 0,
    redrawOnParentResize: true,
  },
  grid: {
    padding: {
      left: 10,  
      right: 15, 
    }
  },
  stroke: {
    curve: 'smooth',
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
    },
  },
  xaxis: {
    categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  },
  dataLabels: { enabled: false },
  colors: ['#3B82F6'], 
});


const barSeries = ref([
  {
    name: 'Quantidade',
    data: [2, 3, 7, 3, 0], 
  },
]);

const barOptions = ref({
  chart: {
    toolbar: { show: false },
    redrawOnParentResize: true,
  },
  plotOptions: {
    bar: {
      borderRadius: 4,    
      columnWidth: '35%', 
    }
  },
  xaxis: {
    categories: ['Jan', 'Fev', 'Mar', 'Abr'],
  },
  dataLabels: { enabled: false },
  colors: ['#3B82F6'], 
});

const activeUsersSeries = ref([8, 2]);

const activeUsersOptions = ref({
  chart: { 
    redrawOnParentResize: true 
  },
  labels: ['Ativos', 'Inativos'],
  legend: { 
    position: 'bottom' 
  },
  dataLabels: { 
    enabled: false 
  },
  colors: ['#10B981', '#94A3B8'], 
});
</script>
