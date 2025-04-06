<script setup>
import { computed, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FormatRupiah } from "@/utils/FormatRupiah";
import BaseInput from "./form/BaseInput.vue";
import BaseLabel from "./form/BaseLabel.vue";
import axios from "axios";
import Loading from "./Loading.vue";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";

const props = defineProps({
  orders: Array,
});

const resetOrders = defineEmits(["resetOrders"]);

const loading = ref(false);
const items = ref({
  orders: props.orders,
});

// Skema Yup
const schema = yup.object({
  customer_name: yup.string().required("Nama pelanggan wajib diisi"),
  table_no: yup.string().required("Nomor meja wajib diisi"),
});

// Inisialisasi form dan field
const { validate, errors } = useForm({ validationSchema: schema });
const { value: customer_name } = useField("customer_name");
const { value: table_no } = useField("table_no");

const paymentOrders = async () => {
  const { valid, errors: validationErrors } = await validate();

  // return console.log(validationErrors);

  if (!valid) {
    return;
  }

  loading.value = true;
  const itemId = items.value.orders.map((item) => {
    return {
      id: item.id,
      qty: item.quantity,
    };
  });
  // console.log(itemId);

  try {
    const response = await axios.post(
      "http://localhost:8000/api/order",
      {
        customer_name: customer_name.value,
        table_no: table_no.value,
        items: itemId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      items.value.orders = [];
      resetOrders("resetOrders");

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Pesanan berhasil dibuat",
        showConfirmButton: true,
      });

      return;
    }
  } catch (error) {
    return console.log(error);
  } finally {
    loading.value = false;
  }
};

const total = computed(() => {
  return props.orders.reduce((total, item) => {
    const jmlhQty = item.quantity || 1;
    const totalHarga = item.price * jmlhQty;
    return total + totalHarga;
  }, 0); // 0 adalah nilai awal
});

const incrementQuantity = (id) => {
  // return console.log(id);

  const item = props.orders.find((item) => item.id === id);
  if (item) {
    item.quantity = (item.quantity || 0) + 1;
  }
};

const decrementQuantity = (id) => {
  const item = props.orders.find((item) => item.id === id);
  if (item) {
    if (item.quantity === 1) return;
    item.quantity = (item.quantity || 0) - 1;
  }
};

const deleteProduct = (id) => {
  // console.log(id);
  if (id) {
    const item = props.orders.find((item) => item.id === id);
    if (item) {
      props.orders.splice(props.orders.indexOf(item), 1);
    }
  }
};
</script>
<template>
  <div class="w-full flex flex-col gap-2">
    <div>
      <base-label forHtml="customer_name" label="Customer" />
      <base-input id="customer_name" type="text" v-model="customer_name" />
      <p class="text-red-400 text-[10px]">{{ errors.customer_name }}</p>
    </div>
    <div>
      <base-label forHtml="no_meja" label="No Meja" />
      <base-input id="no_meja" type="text" v-model="table_no" />
      <p class="text-red-400 text-[10px]">{{ errors.table_no }}</p>
    </div>
  </div>

  <!-- cart order -->
  <div class="w-full flex flex-col justify-between gap-2">
    <div
      class="flex flex-col justify-between w-full gap-3"
      v-for="item in orders"
      :key="item.id"
    >
      <div class="flex justify-between w-full items-center">
        <h4 class="text-sm">{{ item.name }}</h4>
        <p class="text-sm">{{ FormatRupiah(item.price * item.quantity) }}</p>
      </div>
      <p class="text-[10px]">@{{ FormatRupiah(item.price) }}</p>
      <div class="flex justify-between items-center">
        <div class="flex gap-3 items-center">
          <button
            @click="incrementQuantity(item.id)"
            class="px-4 rounded bg-gray-300 cursor-pointer active:bg-gray-400 text-slate-800"
          >
            +
          </button>
          <span>{{ item.quantity }}</span>
          <button
            @click="decrementQuantity(item.id)"
            :disabled="item.quantity === 1"
            :class="{ 'opacity-50 cursor-not-allowed': item.quantity === 1 }"
            class="px-4 rounded-lg bg-gray-300 cursor-pointer active:bg-gray-400 text-slate-800"
          >
            -
          </button>
        </div>
        <div>
          <button @click="deleteProduct(item.id)">
            <font-awesome-icon
              :icon="faTrash"
              class="text-red-500 cursor-pointer"
            />
          </button>
        </div>
      </div>
    </div>

    <hr class="text-slate-300" />
    <div class="flex justify-between items-center mt-3">
      <h2 class="font-bold text-2xl">Sub Total</h2>
      <p>{{ FormatRupiah(total) }}</p>
    </div>

    <div class="w-full mt-3">
      <button
        class="py-2 px-4 bg-blue-500 text-white rounded-lg w-full text-base text-center flex items-center justify-center gap-2"
        @click="paymentOrders"
      >
        <Loading v-if="loading" />
        <span v-else>Submit</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
