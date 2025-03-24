<script setup>
import Loading from "./Loading.vue";
const props = defineProps(["itemsProducts", "loading"]);

const emit = defineEmits(["deleteItem"]);

const urlImage = "http://127.0.0.1:8000/storage/";
</script>
<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Product name</th>
          <th scope="col" class="px-6 py-3">Price</th>
          <th scope="col" class="px-6 py-3">Category</th>
          <th scope="col" class="px-6 py-3">Image</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in itemsProducts"
          :key="item.id"
          class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ item.name }}
          </th>
          <td class="px-6 py-4">{{ item.price }}</td>
          <td class="px-6 py-4">
            <span
              class="py-1 px-1 bg-cyan-500 text-white text-[10px] rounded-lg"
              >{{ item.category }}</span
            >
          </td>
          <td class="px-6 py-4">
            <img :src="urlImage + item.image" alt="" width="30" />
          </td>
          <td class="px-6 py-4">
            <RouterLink
              :to="{ name: 'update-product', params: { id: item.id } }"
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit</RouterLink
            >
            |
            <button
              @click.prevent="$emit('deleteItem', item.id)"
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline flex items-center gap-2"
            >
              <Loading v-if="loading  === item.id" />
              <span v-else>Delete</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style lang="scss" scoped></style>
