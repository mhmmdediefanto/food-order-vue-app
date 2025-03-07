<script setup>
import router from "@/router";
import axios from "axios";
import Loading from "@/components/Loading.vue";

import { onMounted, ref } from "vue";

const errorMessage = ref("");
const loading = ref(false);

const form = ref({
  email: "",
  password: "",
});

onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    router.push({ name: "home" });
  }
});

const handleLogin = async () => {
  try {
    loading.value = true;
    const response = await axios.post(
      "http://localhost:8000/api/auth/login",
      {
        email: form.value.email,
        password: form.value.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Pastikan token tersedia sebelum menyimpannya
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.data.email);
      localStorage.setItem("name", response.data.data.name);
      localStorage.setItem("role_id", response.data.data.role_id);

      router.push({ name: "home" });
    } else {
      throw new Error("Token tidak ditemukan dalam respons");
    }
  } catch (error) {
    // Cek apakah error.response tersedia
    errorMessage.value =
      error.response?.data?.message || "Terjadi kesalahan, silakan coba lagi.";
  } finally {
    form.value.email = "";
    form.value.password = "";
    loading.value = false;
  }
};
</script>
<template lang="">
  <div class="flex items-center justify-center h-screen w-full">
    <div
      class="lg:w-1/3 w-full mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8"
    >
      <div class="w-full flex flex-col items-center justify-center my-3">
        <h1 class="text-2xl font-bold">Login</h1>

        <p class="text-[11px] text-red-400 italic">{{ errorMessage }}</p>
      </div>
      <form @submit.prevent>
        <div class="mb-5">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-slate-800"
            >Your email</label
          >
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@flowbite.com"
            autocomplete="email"
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-slate-800"
            >Your password</label
          >
          <input
            type="password"
            id="password"
            v-model="form.password"
            autocomplete="current-password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          @click="handleLogin()"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <span v-if="!loading">Login</span>
          <Loading v-if="loading" />
        </button>
      </form>
    </div>
  </div>
</template>
<style lang="" scoped></style>
