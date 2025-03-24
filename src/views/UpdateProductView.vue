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
import { useField, useForm } from "vee-validate";
import { ProdukValidation } from "@/validation/ProdukValidation";

const users = ref({
  name: "",
  email: "",
  role_id: "",
});

// loading
const loading = ref(false);
const loadingUpdate = ref(false);
const imageFile = ref(null);
// Kategori Produk
const categories = [
  { value: "Makanan", label: "Makanan" },
  { value: "Minuman", label: "Minuman" },
  { value: "Snack", label: "Snack" },
];
const { handleSubmit } = useForm({
  validationSchema: ProdukValidation,

});

// console.log(handleSubmit.arguments);
const { value: name, errorMessage: nameError } = useField("name");
const { value: typeCategory, errorMessage: categoryError } =
  useField("typeCategory");
const { value: price, errorMessage: priceError } = useField("price");
const { value: deskription, errorMessage: descriptionError } =
  useField("deskription");
const { value: gambarProduct, errorMessage: imageError } = useField("gambarProduct");

const produkId = ref("");

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

    // console.log(response.data.data);

    if (response.data.status === 404) {
      alert("Produk tidak ditemukan");
      return router.push({ name: "product" });
    }

    // console.log(response);

    name.value = response.data.data.name;
    typeCategory.value = response.data.data.category;
    price.value = response.data.data.price;
    deskription.value = response.data.data.description;
    gambarProduct.value = response.data.data.image;
  } catch (error) {
    console.error("Error fetching product:", error);
    alert("Terjadi kesalahan saat mengambil data produk.");
  } finally {
    loading.value = false;
  }
};

const handleUpdateProduct = async () => {
  console.log("okeokeok")

  try {
    loadingUpdate.value = true;

    // console.log(values);

    let fromData = new FormData();
    fromData.append("name", name.value);
    fromData.append("category", typeCategory.value);
    fromData.append("price", price.value);
    fromData.append("description", deskription.value);

    if (gambarProduct.value) {
      fromData.append("image", gambarProduct.value);
    }
    /* jika pakek FormData misal mau update data maka jika method dari si backendnya pakek patch maka diperlukan perubahan method di Formdatanya
    seperti contoh dibawah ini */
    fromData.append("_method", "patch");

    // Debugging: Cek isi FormData sebelum dikirim
    // for (let pair of fromData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    const response = await axios.post(
      `http://127.0.0.1:8000/api/items/${produkId.value}`,
      fromData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response);
  } catch (error) {
    console.error("Error getting product:", error);
    alert("Terjadi kesalahan saat mengambil data produk.");
  } finally {
    loadingUpdate.value = false;
  }
};
// handle image changed
const handleImageChanged = (e) => {
  // console.log(e);
  if (!e.target.files[0]) return console.log("tidak ada gambar");

  gambarProduct.value = e.target.files[0];

  imageFile.value = e.target.files[0];
};

console.log(loadingUpdate.value);
console.log(loading.value);
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
      @submit.prevent="handleUpdateProduct"
      class="w-full lg:w-2/3 md:w-2/4"
      v-show="!loading"
    >
      <div class="mb-3">
        <BaseLabel htmlFor="name" label="Nama Produk" />
        <BaseInput type="text" id="name" v-model="name" />
        <p v-if="nameError" class="text-red-500 text-sm italic">
          {{ nameError }}
        </p>
      </div>
      <div class="mb-3">
        <BaseLabel htmlFor="price" label="Harga" />
        <BaseInput type="number" id="price" v-model="price" />
        <p v-if="priceError" class="text-red-500 text-sm italic">
          {{ priceError }}
        </p>
      </div>
      <div class="mb-3">
        <BaseLabel htmlFor="typeCategory" label="Kategori" />
        <BaseInputSelect
          id="typeCategory"
          v-model="typeCategory"
          :options="categories"
        />
        <p v-if="categoryError" class="text-red-500 text-sm italic">
          {{ categoryError }}
        </p>
      </div>
      <div class="mb-3">
        <BaseLabel htmlFor="descriptionProduk" label="Deskripsi" />
        <BaseInput type="text" id="descriptionProduk" v-model="deskription" />
        <p class="text-red-500 text-sm italic" v-if="descriptionError">
          {{ descriptionError }}
        </p>
      </div>
      <div class="mb-3 overflow-hidden">
        <img
          :src="`http://localhost:8000/storage/${gambarProduct}`"
          alt=""
          class="w-32"
        />
        <BaseLabel htmlFor="image" label="Gambar" />
        <BaseInput
          id="image"
          type="file"
          @change="handleImageChanged($event)"
        />
      </div>
      <div>
        <button
          class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-3"
          type="submit"
        >
          <div class="flex justify-center items-center">
            <Loading v-if="loadingUpdate" />
            <span v-else>Update Produk</span>
          </div>
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
