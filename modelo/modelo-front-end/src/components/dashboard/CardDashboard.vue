<template>
  <q-card
    class="my-card q-my-sm"
    v-for="cardInfo in infoDashboard"
    :key="cardInfo.title"
    :style="`background: ${cardInfo.backgroundColor}`"
  >
    <q-card-section>
      <div>
        <div>
          <q-icon
            :name="cardInfo.icon"
            :size="cardInfo.size_icon"
            :color="cardInfo.iconColor"
            class="q-mb-lg"
          />
        </div>
        <div class="" id="cardNum">
          <p
            class="text-bold text-center"
            :style="`color: ${cardInfo.amountColor}`"
          >
            {{ cardInfo.amount }}
          </p>
        </div>
        <div class="flex justify-center" id="cardTitle">
          <p class="text-center">{{ cardInfo.title }}</p>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  infoDashboard: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 400px;
  height: auto;
  color: #535353;
  transition: 0.3s;
  box-shadow: 1px 4px 5px 2px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
}

.my-card:hover {
  background-color: #f5f7d1 !important;
  padding-left: 10px;
}

#cardNum {
  font-size: 5em;
}

#cardTitle {
  font-size: 1.5em;
  margin: 0 !important;
  padding: 0;
}

#cardNum p {
  font-size: 0.5em;
  line-height: 1;
}
</style>
