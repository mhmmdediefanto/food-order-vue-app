<script setup>
import { computed, onMounted, ref } from "vue";
import Navbar from "@/components/Navbar.vue";
import TableProduct from "@/components/TableProduct.vue";
import router from "@/router";
import axios from "axios";

const itemsProcuts = ref([]);
const users = ref({
  name: "",
  email: "",
  role_id: "",
});

const loading = ref(null);

onMounted(() => {
  users.value.role_id = localStorage.getItem("role_id");

  // Jika role_id bukan 3 dan bukan 4, redirect ke home
  if (users.value.role_id !== "3") {
    return router.push({ name: "home" });
  }

  const token = localStorage.getItem("token");
  if (!token) {
    return router.push({ name: "login" });
  }

  users.value.name = localStorage.getItem("name");
  users.value.email = localStorage.getItem("email");

  getData();
});

const isLogined = computed(() => {
  const token = localStorage.getItem("token");

  return token ? true : false;
});

const getData = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/items", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    itemsProcuts.value = response.data.data.items.data;
  } catch (error) {
    console.log(error);
  }
};

const handleDelete = async (id) => {
  try {
    loading.value = id;
    const response = await axios.delete(
      `http://127.0.0.1:8000/api/items/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      alert("Product berhasil dihapus");
      getData();
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = null;
  }
};
</script>
<template>
  <div>
    <Navbar
      :name="users.name"
      :email="users.email"
      :isLogined="isLogined"
      :role_id="users.role_id"
    />
  </div>

  <div class="w-full flex items-center justify-center py-10">
    <div class="w-2/3">
      <h1 class="font-bold text-2xl my-2">Product List</h1>
      <div class="my-4">
        <router-link
          to="/add-product"
          class="py-2 px-2 bg-cyan-600 rounded-lg text-white text-sm capitalize"
          >Tambah product</router-link
        >
      </div>
      <div>
        <TableProduct
          :itemsProducts="itemsProcuts"
          @deleteItem="handleDelete"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
