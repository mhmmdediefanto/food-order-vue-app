<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  orders: Array,
});


const total = computed(() => {
  return props.orders.reduce((total, item) => {
    console.log("📌 Harga item:", item.price); // Debugging
    return total + item.price * (item.quantity || 1);
  }, 0); // 0 adalah nilai awal
});
</script>
<template>
  <!-- cart order -->
  <div class="w-full flex flex-col justify-between gap-2">
    <div
      class="flex flex-col justify-between w-full gap-3"
      v-for="item in orders"
      :key="item.id"
    >
      <div class="flex justify-between w-full items-center">
        <h4>{{ item.name }}</h4>
        <p>Rp. {{ item.price }}</p>
      </div>
      <div class="flex gap-3 items-center">
        <button
          class="px-4 rounded bg-gray-300 cursor-pointer active:bg-gray-400 text-slate-800"
        >
          +
        </button>
        <span>1</span>
        <button
          class="px-4 rounded-lg bg-gray-300 cursor-pointer active:bg-gray-400 text-slate-800"
        >
          -
        </button>
      </div>
    </div>

    <hr class="text-slate-300" />
    <div class="flex justify-between items-center mt-3">
      <h2 class="font-bold text-2xl">Sub Total</h2>
      <p>{{ total }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
