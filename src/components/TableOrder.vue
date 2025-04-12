<script setup>
import { FormatRupiah } from "@/utils/FormatRupiah";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const props = defineProps(["orderLists"]);
defineEmits(["viewOrder"]);
</script>
<template>
  <table class="min-w-full">
    <thead class="bg-white border-b">
      <tr>
        <th
          scope="col"
          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
        >
          #
        </th>
        <th
          scope="col"
          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
        >
          Nama Customer
        </th>
        <th
          scope="col"
          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
        >
          No Meja
        </th>
        <th
          scope="col"
          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
        >
          Tanggal Order
        </th>
        <th
          scope="col"
          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
        >
          Total Harga
        </th>
        <th
          scope="col"
          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
        >
          Status
        </th>
        <th
          scope="col"
          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
        >
          Action
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        class="bg-gray-100 border-b"
        v-for="(order, index) in orderLists"
        :key="index"
      >
        <td
          class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
        >
          {{ index + 1 }}
        </td>
        <td
          class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
        >
          {{ order.customer_name }}
        </td>
        <td
          class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
        >
          {{ order.table_no }}
        </td>
        <td
          class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
        >
          {{ order.order_date }}
        </td>
        <td
          class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
        >
          {{ FormatRupiah(order.total_amount) }}
        </td>
        <td
          class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
        >
          {{ order.status }}
        </td>
        <td
          class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap flex items-center justify-center"
        >
          <button>
            <FontAwesomeIcon
              :icon="faEye"
              class="text-cyan-500 cursor-pointer hover:text-cyan-600"
              @click="$emit('viewOrder', order.id)"
            />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
