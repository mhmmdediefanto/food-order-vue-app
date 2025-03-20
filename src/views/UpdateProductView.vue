<script setup>
import Navbar from "@/components/Navbar.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import BaseLabel from "@/components/form/BaseLabel.vue";
import BaseInputSelect from "@/components/form/BaseInputSelect.vue";
import Loading from "@/components/Loading.vue";
import { computed, onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import axios from "axios";

const users = ref({
  name: "",
  email: "",
  role_id: "",
});

// loading
const loading = ref(false);
// Kategori Produk
const categories = [
  { value: "Makanan", label: "Makanan" },
  { value: "Minuman", label: "Minuman" },
  { value: "Snack", label: "Snack" },
];

const produkId = ref("");
const produk = ref({
  name: "",
  category: "",
  price: "",
  description: "",
  image: "",
});

const route = useRoute();

const isLogined = computed(() => !!localStorage.getItem("token"));

onMounted(() => {
  users.value.role_id = localStorage.getItem("role_id");
  if (users.value.role_id !== "3") return route.push({ name: "home" });

  const token = localStorage.getItem("token");
  if (!token) return router.push({ name: "login" });

  users.value.name = localStorage.getItem("name");
  users.value.email = localStorage.getItem("email");

  produks();
});

watchEffect(() => {
  // ambil id produk
  const urlId = route.params.id;
  produkId.value = urlId;
});

const produks = async () => {
  loading.value = true;
  try {
    const response = await axios.get(
      `http://localhost:8000/api/items/${produkId.value}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(response.data.data);

    if (response.data.status === 404) {
      alert("Produk tidak ditemukan");
      return router.push({ name: "product" });
    }

    Object.assign(produk.value, response.data.data);

    // produk.value.name = response.data.data.name;
    // produk.value.category = response.data.data.category;
    // produk.value.price = response.data.data.price;
    // produk.value.description = response.data.data.description;
    // produk.value.image = response.data.data.image;
  } catch (error) {
    console.error("Error fetching product:", error);
    alert("Terjadi kesalahan saat mengambil data produk.");
  } finally {
    loading.value = false;
  }
};

console.log(produk.value);
</script>
<template>
  <div
    class="absolute h-[100vh] w-full mx-auto flex justify-center items-center"
    v-if="loading"
  >
    <Loading />
  </div>
  <div>
    <Navbar
      :name="users.name"
      :email="users.email"
      :isLogined="isLogined"
      :role_id="users.role_id"
    />
  </div>

  <h2 class="font-bold text-2xl my-2 text-center">Halaman update Produk</h2>
  <div class="flex w-full justify-center px-5">
    <form
      @submit.prevent="handleAddProduct"
      class="w-full lg:w-2/3 md:w-2/4"
      v-show="!loading"
    >
      <div class="mb-3">
        <BaseLabel htmlFor="name" label="Nama Produk" />
        <BaseInput type="text" id="name" v-model="produk.name" />
      </div>
      <div class="mb-3">
        <BaseLabel htmlFor="price" label="Harga" />
        <BaseInput type="number" id="price" v-model="produk.price" />
      </div>
      <div class="mb-3">
        <BaseLabel htmlFor="typeCategory" label="Kategori" />
        <BaseInputSelect
          id="typeCategory"
          v-model="produk.category"
          :options="categories"
        />
      </div>
      <div class="mb-3">
        <BaseLabel htmlFor="deskription" label="Deskripsi" />
        <BaseInput type="text" id="deskription" v-model="produk.description" />
      </div>
      <div class="mb-3 overflow-hidden">
        <img
          :src="`http://localhost:8000/storage/${produk.image}`"
          alt=""
          class="w-full"
          v-show="produk.image"
        />
        <BaseLabel htmlFor="gambarProduct" label="Gambar" />
        <BaseInput
          id="gambarProduct"
          type="file"
          @change="handleImageChanged"
        />
      </div>
      <div>
        <button
          class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-3"
          type="submit"
        >
          <div class="flex justify-center items-center">
            <Loading v-if="loading" />
            <span v-else>Update Produk</span>
          </div>
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
