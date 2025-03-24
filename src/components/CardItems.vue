<script setup>
import { computed } from "vue";

const props = defineProps(["loading", "items", "search"]);

const emit = defineEmits(["order"]);

const filteredItems = computed(() => {
  return props.items.filter((item) =>
    item.name.toLowerCase().includes(props.search.toLowerCase())
  );
});
</script>
<template lang="">
  <div
    v-for="item in filteredItems"
    :key="item.id"
    class="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
  >
    <a href="#">
      <img class="rounded-t-lg" src="" alt="" />
    </a>
    <div class="p-5 flex flex-col justify-between h-full w-full">
      <div>
        <a href="#">
          <h5
            class="mb-2 text-[16px] font-bold tracking-tight text-gray-900 dark:text-white"
          >
            {{ item.name }}
          </h5>
        </a>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {{ item.price }}
        </p>
      </div>
      <div>
        <a
          href="#"
          @click.prevent="$emit('order', item.id)"
          class="inline-flex items-center px-2 py-1 text-[12px] font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Order
          <svg
            class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
  <div v-if="filteredItems.length === 0 && !loading">
    <p class="text-center text-red-400">No data</p>
  </div>
</template>
<style lang=""></style>
