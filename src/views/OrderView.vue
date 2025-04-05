<script setup>
import Navbar from "@/components/Navbar.vue";
import Loading from "@/components/Loading.vue";
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import router from "@/router";
import CardItems from "@/components/CardItems.vue";
import CartOrder from "@/components/CartOrder.vue";

const users = ref({
  name: "",
  email: "",
  role_id: "",
});

const orders = ref([]);

const search = ref("");

const items = ref([]);
const loading = ref(false);

onMounted(() => {
  users.value.role_id = localStorage.getItem("role_id");

  // Jika role_id bukan 3 dan bukan 4, redirect ke home
  if (users.value.role_id !== "3" && users.value.role_id !== "4") {
    return router.push({ name: "home" });
  }

  const token = localStorage.getItem("token");
  if (!token) {
    return router.push({ name: "login" });
  }
  // console.log("onmounted");

  users.value.name = localStorage.getItem("name");
  users.value.email = localStorage.getItem("email");

  getData();
});

const getData = async () => {
  console.log("get data");

  try {
    loading.value = true;
    const response = await axios.get("http://localhost:8000/api/items", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // console.log(response);

    items.value = response.data.data.items.data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const isLogined = computed(() => {
  const token = localStorage.getItem("token");

  return token ? true : false;
});

import { toRaw } from "vue";

// Buat Map untuk mempercepat pencarian
const ordersMap = computed(
  () => new Map(orders.value.map((order) => [order.id, order]))
);

const handleOrder = (id) => {
  const item = items.value.find((item) => item.id === id);
  if (!item) return;

  // Gunakan Map untuk pencarian cepat
  if (ordersMap.value.has(item.id)) {
    alert("Item sudah ada di keranjang");
  } else {
    orders.value.push({ ...toRaw(item), quantity: 1 });
  }

  // console.log(orders.value);
};
</script>

<template>
  <div
    class="absolute bg-red-500 h-[100vh] w-full mx-auto flex justify-center items-center"
    v-if="loading"
  >
    <Loading />
  </div>
  <Navbar
    :name="users.name"
    :email="users.email"
    :isLogined="isLogined"
    :role_id="users.role_id"
  />
  <div class="my-10 w-full px-4">
    <div class="w-full flex my-3 items-center justify-center">
      <div
        class="lg:w-1/2 w-full flex gap-2 items-center flex-wrap lg:flex-nowrap"
      >
        <label for="search" class="text-lg font-bold">Search</label>
        <input
          type="text"
          class="w-full border border-gray-400 rounded-lg p-1"
          v-model="search"
        />
      </div>
    </div>
    <h1 class="text-2xl font-bold pt-3">Order</h1>
    <div
      :class="
        orders.length === 0
          ? 'lg:grid-cols-7 grid'
          : 'grid grid-cols-1 gap-4 lg:grid-cols-4'
      "
    >
      <div
        :class="
          orders.length === 0
            ? 'grid grid-cols-1 lg:col-span-7'
            : 'grid grid-cols-1 lg:col-span-3'
        "
      >
        <div
          :class="
            orders.length === 0
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3'
              : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'
          "
        >
          <!-- item product -->
          <CardItems
            :items="items"
            :loading="loading"
            :search="search"
            @order="handleOrder"
          />
        </div>
      </div>
      <div class="w-full px-2 flex flex-col gap-2" v-if="orders.length > 0">
        <h2 class="text-center text-2xl font-bold">Cart Order List</h2>

        <CartOrder :orders="orders" @resetOrders="orders = []" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
