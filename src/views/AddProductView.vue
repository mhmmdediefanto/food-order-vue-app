<script setup>
import Navbar from "@/components/Navbar.vue";
import BaseLabel from "@/components/form/BaseLabel.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import BaseInputSelect from "@/components/form/BaseInputSelect.vue";
import { computed, onMounted, ref } from "vue";
import router from "@/router";
import axios from "axios";
import Loading from "@/components/Loading.vue";
const users = ref({
  name: "",
  email: "",
  role_id: "",
});

const loading = ref(false);

const categories = [
  { value: "Makanan", label: "Makanan" },
  { value: "Minuman", label: "Minuman" },
  { value: "Snack", label: "Snack" },
];

const product = ref({
  name: "",
  price: "",
  typeCategory: "",
  deskription: "",
  image: "",
});

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
});

const isLogined = computed(() => {
  const token = localStorage.getItem("token");

  return token ? true : false;
});

const handleAddProduct = async () => {
  const formData = new FormData();
  formData.append("name", product.value.name);
  formData.append("price", product.value.price);
  formData.append("category", product.value.typeCategory);
  formData.append("description", product.value.deskription);
  formData.append("image", product.value.image); // Pastikan ini adalah file (bukan string)

 
  try {
    loading.value = true;
    const response = await axios.post(
      "http://127.0.0.1:8000/api/items",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      alert("Product berhasil ditambahkan");
      router.push({ name: "product" });
      return;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    product.value.name = "";
    product.value.price = "";
    product.value.typeCategory = "";
    product.value.deskription = "";

    return;
  }
};

const handleImageChanged = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  product.value.image = file;
  return;
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
  <div>
    <h2 class="font-bold text-2xl my-2 text-center">Halaman tambah product</h2>
    <div class="flex w-full justify-center px-5">
      <form @submit.prevent="handleAddProduct" class="w-full lg:w-2/3 md:w-2/4">
        <div class="w-full p-4 rounded-lg">
          <div class="mb-3">
            <BaseLabel forHtml="name" label="Nama Product" />
            <BaseInput id="name" v-model="product.name" type="text" />
          </div>
          <div class="mb-3">
            <BaseLabel forHtml="price" label="Price" />
            <BaseInput id="price" v-model="product.price" type="number" />
          </div>
          <div class="mb-3">
            <BaseLabel forHtml="typeCategory" label=" Category" />
            <BaseInputSelect
              id="typeCategory"
              v-model="product.typeCategory"
              :options="categories"
            />
          </div>
          <div class="mb-3">
            <BaseLabel forHtml="deskription" label="Deskription" />
            <BaseInput
              id="deskription"
              v-model="product.deskription"
              type="text"
            />
          </div>
          <div class="mb-3">
            <BaseLabel forHtml="gambarProduct" label="Gambar" />
            <BaseInput
              id="gambarProduct"
              type="file"
              @change="handleImageChanged($event)"
            />
          </div>
        </div>
        <div class="mb-3">
          <button
            class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            <div class="flex justify-center items-center">
              <Loading v-if="loading" />
              <span v-else> Tambah Product</span>
            </div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
