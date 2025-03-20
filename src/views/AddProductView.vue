<script setup>
import Navbar from "@/components/Navbar.vue";
import BaseLabel from "@/components/form/BaseLabel.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import BaseInputSelect from "@/components/form/BaseInputSelect.vue";
import { computed, onMounted, ref } from "vue";
import router from "@/router";
import axios from "axios";
import Loading from "@/components/Loading.vue";
import { ProdukValidation } from "@/validation/ProdukValidation";
import { useField, useForm } from "vee-validate";

// Data User
const users = ref({
  name: "",
  email: "",
  role_id: "",
});

const loading = ref(false);

// Kategori Produk
const categories = [
  { value: "Makanan", label: "Makanan" },
  { value: "Minuman", label: "Minuman" },
  { value: "Snack", label: "Snack" },
];

// Form Validation
const { handleSubmit, resetForm } = useForm({
  validationSchema: ProdukValidation,
});

// Menggunakan useField() dengan benar
const { value: name, errorMessage: nameError } = useField("name");
const { value: price, errorMessage: priceError } = useField("price");
const { value: typeCategory, errorMessage: typeCategoryError } =
  useField("typeCategory");
const { value: deskription, errorMessage: deskriptionError } =
  useField("deskription");
const { value: gambarProduct, errorMessage: gambarProductError } =
  useField("gambarProduct");

// Mengecek Login dan Role
onMounted(() => {
  users.value.role_id = localStorage.getItem("role_id");
  if (users.value.role_id !== "3") return router.push({ name: "home" });

  const token = localStorage.getItem("token");
  if (!token) return router.push({ name: "login" });

  users.value.name = localStorage.getItem("name");
  users.value.email = localStorage.getItem("email");
});

// Mengecek apakah user login
const isLogined = computed(() => !!localStorage.getItem("token"));

// Fungsi Menambah Produk
const handleAddProduct = handleSubmit(async (values) => {
  console.log("values:", values);

  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("price", values.price);
  formData.append("category", values.typeCategory);
  formData.append("description", values.deskription);
  formData.append("image", gambarProduct.value); // Pastikan ini file, bukan string

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

    if (response.status >= 200 && response.status < 300) {
      alert("Product berhasil ditambahkan");
      resetForm(); // Reset form setelah submit sukses
      router.push({ name: "product" });
    }
  } catch (error) {
    console.error(
      "Gagal menambahkan produk:",
      error.response?.data || error.message
    );
  } finally {
    loading.value = false;
  }
});

// Fungsi untuk menangani upload gambar
const handleImageChanged = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  gambarProduct.value = file; // Simpan file di gambarProduct
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
    <h2 class="font-bold text-2xl my-2 text-center">Halaman Tambah Produk</h2>
    <div class="flex w-full justify-center px-5">
      <form @submit.prevent="handleAddProduct" class="w-full lg:w-2/3 md:w-2/4">
        <div class="w-full p-4 rounded-lg">
          <div class="mb-3">
            <BaseLabel forHtml="name" label="Nama Produk" />
            <BaseInput id="name" v-model="name" type="text" />
            <span class="text-red-500" v-if="nameError">{{ nameError }}</span>
          </div>
          <div class="mb-3">
            <BaseLabel forHtml="price" label="Harga" />
            <BaseInput id="price" v-model="price" type="number" />
            <span class="text-red-500" v-if="priceError">{{ priceError }}</span>
          </div>
          <div class="mb-3">
            <BaseLabel forHtml="typeCategory" label="Kategori" />
            <BaseInputSelect
              id="typeCategory"
              v-model="typeCategory"
              :options="categories"
            />
            <span class="text-red-500" v-if="typeCategoryError">{{
              typeCategoryError
            }}</span>
          </div>
          <div class="mb-3">
            <BaseLabel forHtml="deskription" label="Deskripsi" />
            <BaseInput id="deskription" v-model="deskription" type="text" />
            <span class="text-red-500" v-if="deskriptionError">{{
              deskriptionError
            }}</span>
          </div>
          <div class="mb-3">
            <BaseLabel forHtml="gambarProduct" label="Gambar" />
            <BaseInput
              id="gambarProduct"
              type="file"
              @change="handleImageChanged"
            />
            <span class="text-red-500" v-if="gambarProductError">{{
              gambarProductError
            }}</span>
          </div>
        </div>
        <div class="mb-3">
          <button
            class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            <div class="flex justify-center items-center">
              <Loading v-if="loading" />
              <span v-else>Tambah Produk</span>
            </div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
