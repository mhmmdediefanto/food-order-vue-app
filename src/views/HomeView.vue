<script setup>
import { computed, onMounted, ref } from "vue";
import Navbar from "@/components/Navbar.vue";
import router from "@/router";

const users = ref({
  name: "",
  email: "",
  role_id: "",
});

onMounted(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push({ name: "login" });
  }

  users.value.name = localStorage.getItem("name");
  users.value.email = localStorage.getItem("email");
  users.value.role_id = localStorage.getItem("role_id");
});

const isLogined = computed(() => {
  const token = localStorage.getItem("token");

  return token ? true : false;
});
</script>
<template>
  <!-- navbar component -->
  <Navbar :name="users.name" :email="users.email" :isLogined="isLogined" :role_id="users.role_id"/>

  <div>
    <h1>{{ users.name }}</h1>
  </div>
</template>
<style scoped></style>
