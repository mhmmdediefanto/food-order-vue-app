<script setup>
import Navbar from "@/components/Navbar.vue";
import TableOrder from "@/components/TableOrder.vue";
import router from "@/router";
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import { FormatRupiah } from "@/utils/FormatRupiah";
import Loading from "@/components/Loading.vue";

const loading = ref({
  page: false,
  modal: false,
});
const isOpenModal = ref(false);
const selectedOrder = ref(null);

const users = ref({
  name: "",
  email: "",
  role_id: "",
});
const orderLists = ref([]);

onMounted(() => {
  const token = localStorage.getItem("token");
  users.value.role_id = localStorage.getItem("role_id");
  if (!token) {
    router.push({ name: "login" });
  }

  if (users.value.role_id != "3") {
    router.push({ name: "login" });
  }

  users.value.name = localStorage.getItem("name");
  users.value.email = localStorage.getItem("email");

  fetchDataOrder();
});

const fetchDataOrder = async () => {
  try {
    loading.value.page = true;
    const response = await axios.get("http://localhost:8000/api/order", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status == 200) {
      orderLists.value = response.data.data;
    } else {
      console.log("error");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value.page = false;
  }
};

const fetchOrderDetail = async (id) => {
  if (!id) {
    return;
  }

  try {
    loading.value.modal = true;
    const idModalOrder = id;

    isOpenModal.value = true;
    const response = await axios.get(
      `http://localhost:8000/api/order/${idModalOrder}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status == 200) {
      console.log(response.data.data);
      selectedOrder.value = response.data.data;
    } else {
      console.log("error");
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value.modal = false;
  }
};

const closeModal = () => {
  isOpenModal.value = false;
  selectedOrder.value = null;
};

const isLogined = computed(() => {
  const token = localStorage.getItem("token");

  return token ? true : false;
});
</script>
<template>
  <div>
    <BaseModal :show="isOpenModal" @close="closeModal">
      <template #header>
        <h2 class="text-xl font-semibold">Detail Order</h2>
      </template>
      <template #footer>
        <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded">
          Tutup
        </button>
      </template>

      <div class="flex justify-center items-center" v-if="loading.modal">
        <Loading />
      </div>
      <div class="mt-4 w-full" v-else>
        <div class="grid grid-cols-2 gap-4 w-full text-sm">
          <p>Customer Name : {{ selectedOrder?.customer_name }}</p>
          <p>Table No : {{ selectedOrder?.table_no }}</p>
          <p>Order Date : {{ selectedOrder?.order_date }}</p>
          <p>Order Time : {{ selectedOrder?.order_time }}</p>
          <p>Status : {{ selectedOrder?.status }}</p>
        </div>
        <div class="w-full py-3">
          <p>Items :</p>
          <div class="relative overflow-x-auto py-2">
            <table
              class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" class="px-6 py-3">Product Name</th>
                  <th scope="col" class="px-6 py-3">Category</th>
                  <th scope="col" class="px-6 py-3">Price</th>
                  <th scope="col" class="px-6 py-3">quantity</th>
                  <th scope="col" class="px-6 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in selectedOrder?.order_details"
                  :key="index"
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {{ item.item.name }}
                  </th>
                  <td class="px-6 py-4">{{ item.item.category }}</td>
                  <td class="px-6 py-4">{{ FormatRupiah(item.item.price) }}</td>
                  <td class="px-6 py-4">{{ item.qty }}</td>
                  <td class="px-6 py-4">
                    {{ FormatRupiah(item.item.price * item.qty) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Total Amount : {{ FormatRupiah(selectedOrder?.total_amount) }}</p>
        </div>
      </div>
    </BaseModal>
    <Navbar
      :name="users.name"
      :email="users.email"
      :isLogined="isLogined"
      :role_id="users.role_id"
    />
  </div>
  <div class="my-10 w-full px-4">
    <div class="flex flex-col items-center justify-center">
      <h1 class="text-2xl font-bold">List Order</h1>
      <p class="text-sm text-gray-500">Daftar orderan yang sudah dibuat</p>
    </div>
    <div class="my-3">
      <router-link
        to="/order"
        class="py-2 px-2 bg-cyan-600 rounded-lg text-white text-sm capitalize"
        >Tambah order</router-link
      >
      <div class="flex flex-col">
        <div class="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
          <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div class="overflow-hidden">
              <div class="w-full flex justify-center items-center min-h-full">
                <Loading v-if="loading.page" />
              </div>
              <TableOrder
                v-if="!loading.page"
                :orderLists="orderLists"
                @view-order="fetchOrderDetail"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
