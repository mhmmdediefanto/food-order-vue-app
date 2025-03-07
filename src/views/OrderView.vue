<script setup>
import Navbar from "@/components/Navbar.vue";
import Loading from "@/components/Loading.vue";
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import router from "@/router";
import CardItems from "@/components/CardItems.vue";

const users = ref({
  name: "",
  email: "",
  role_id: "",
});
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
  console.log("onmounted");

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
    <h1 class="text-2xl font-bold">Order</h1>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <div class="grid grid-cols-1 lg:col-span-3">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
         <!-- item product -->
          <CardItems :items="items" :loading="loading" :search="search"/>
        </div>
      </div>
      <div class="border w-full border-slate-800">
        <h2>order</h2>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
