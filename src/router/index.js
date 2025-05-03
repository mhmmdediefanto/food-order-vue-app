import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import OrderView from "@/views/OrderView.vue";
import ProductView from "@/views/ProductView.vue";
import UpdateProductView from "@/views/UpdateProductView.vue";
import AddProductView from "@/views/AddProductView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/order",
      name: "order",
      component: OrderView,
    },
    {
      path: "/product",
      name: "product",
      component: ProductView,
    },
    {
      path: "/add-product",
      name: "add-product",
      component: AddProductView,
    },
    {
      path: "/product/:id",
      name: "update-product",
      component: UpdateProductView,
    },
    {
      path: "/list-order",
      name: "list-order",
      component: () => import("../views/ListOrderView.vue"),
    },
    {
      path: "/report-order",
      name: "report-order",
      component: () => import("@/views/ReportOrderView.vue"),
    },
  ],
});

export default router;
