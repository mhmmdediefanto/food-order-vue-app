<script setup>
import router from "@/router";
import axios from "axios";
import { onMounted, ref, watchEffect } from "vue";

const props = defineProps(["name", "email", "isLogined", "role_id"]);

const errorMessage = ref("");
const role = ref("");

const handleLogout = async () => {
  const token = localStorage.getItem("token");
  console.log(token);

  try {
    await axios.post(
      "http://localhost:8000/api/auth/logout",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("role_id");
    router.push({ name: "login" });
  } catch (error) {
    // Cek apakah error.response tersedia
    console.log(error);

    errorMessage.value =
      error.response?.data?.message || "Terjadi kesalahan, silakan coba lagi.";
  }
};

watchEffect(() => {
  role.value = props.role_id;
});
</script>
<template>
  <div>
    <header v-if="$route.name != 'login'">
      <nav class="bg-white border-gray-200 dark:bg-gray-900">
        <div
          class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
        >
          <span
            class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
            >Food Order</span
          >

          <div
            class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
          >
            <button
              type="button"
              class="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <span class="sr-only">Open user menu</span>
              <img
                class="w-8 h-8 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                alt="user photo"
              />
            </button>
            <!-- Dropdown menu -->
            <div
              class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
              id="user-dropdown"
            >
              <div class="px-4 py-3">
                <span class="block text-sm text-gray-900 dark:text-white">{{
                  name
                }}</span>
                <span
                  class="block text-sm text-gray-500 truncate dark:text-gray-400"
                  >{{ email }}</span
                >
              </div>
              <ul class="py-2" aria-labelledby="user-menu-button">
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >Dashboard</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >Settings</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >Earnings</a
                  >
                </li>
                <li>
                  <button
                    type="button"
                    v-if="isLogined"
                    @click="handleLogout()"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Logout
                  </button>
                  <RouterLink
                    v-else
                    to="/login"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >Login</RouterLink
                  >
                </li>
              </ul>
            </div>
            <button
              data-collapse-toggle="navbar-user"
              type="button"
              class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul
              class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
            >
              <li>
                <RouterLink
                  to="/"
                  class="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                  >Home</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  v-if="role_id == 3 || role_id == 4"
                  to="/order"
                  class="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                  >Order</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  v-if="role_id == 3"
                  to="/product"
                  class="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                  >Product</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  v-if="role_id == 3 || role_id == 1"
                  to="/list-order"
                  class="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                  >List Order</RouterLink
                >
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  </div>
</template>

<style lang=""></style>
