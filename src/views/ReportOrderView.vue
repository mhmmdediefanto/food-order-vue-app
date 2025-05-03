<script setup>
import Navbar from "@/components/Navbar.vue";
import router from "@/router";
import { FormatRupiah } from "@/utils/FormatRupiah";
import axios from "axios";
import { computed, onMounted, reactive, ref } from "vue";

const users = ref({
  name: "",
  email: "",
  role_id: "",
});
const orders = ref([]);
const result = reactive({
  max_order: "",
  min_order: "",
  total_order: "",
  total_amount: "",
});

const month = reactive({
  id: "",
  name: "",
});

onMounted(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push({ name: "login" });
  }

  users.value.name = localStorage.getItem("name");
  users.value.email = localStorage.getItem("email");
  users.value.role_id = localStorage.getItem("role_id");

  getDataReportOrder();
});

const isLogined = computed(() => {
  const token = localStorage.getItem("token");

  return token ? true : false;
});
const getDataReportOrderByMonth = async (e) => {
  const monthSelect = e.target.value;
  const selectedText = e.target.options[e.target.selectedIndex].text;

  month.id = monthSelect;
  month.name = selectedText;

  //   return console.log(month.value.id, month.value.name);

  await getDataReportOrder();
};

const getDataReportOrder = async () => {
  let url = "http://localhost:8000/api/report/order";

  if (month.id) {
    url += `?month=${month.id}`;
  }
  //   console.log(url);

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    orders.value = response.data.data;
    result.max_order = response.data.result.max_order;
    result.min_order = response.data.result.min_order;
    result.total_order = response.data.result.total_order;
    result.total_amount = response.data.result.total_revenue;
  } catch (error) {
    console.error("Error fetching report order data:", error);
  }
};
</script>
<template>
  <!-- navbar component -->
  <Navbar
    :name="users.name"
    :email="users.email"
    :isLogined="isLogined"
    :role_id="users.role_id"
  />

  <div class="container mx-auto p-4">
    <div>
      <select
        name=""
        id=""
        class="px-2 py-1 border border-gray-400 rounded-lg"
        @change="getDataReportOrderByMonth"
      >
        <option value="">Semua Bulan</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
    </div>

    <h1 class="text-2xl font-bold text-center mt-4">
      Report Order
    </h1>
    <p v-if="month.name ">Menampilkan data bulan: <strong>{{ month.name }}</strong></p>
    <div class="w-full flex justify-around items-center my-10">
      <div>
        <p>Total Order : {{ result.total_order }}</p>
      </div>
      <div>
        <p>Total Amount : {{ FormatRupiah(result.total_amount) }}</p>
      </div>
      <div>
        <p>Max Order : {{ FormatRupiah(result.max_order) }}</p>
      </div>
      <div>
        <p>Min Order : {{ FormatRupiah(result.min_order) }}</p>
      </div>
    </div>
    <div class="mt-10">
      <table class="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th class="border border-gray-300 p-2">Order ID</th>
            <th class="border border-gray-300 p-2">Customer Name</th>
            <th class="border border-gray-300 p-2">Total Amount</th>
            <th class="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="orders.length === 0">
            <td colspan="4" class="text-center p-4">No orders found</td>
          </tr>
          <tr v-for="order in orders" :key="order.id">
            <td class="border border-gray-300 p-2">{{ order.id }}</td>
            <td class="border border-gray-300 p-2">
              {{ order.customer_name }}
            </td>
            <td class="border border-gray-300 p-2">
              {{ FormatRupiah(order.total_amount) }}
            </td>
            <td class="border border-gray-300 p-2">{{ order.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="" scoped></style>
