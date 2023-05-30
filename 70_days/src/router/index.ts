import { createRouter, createWebHistory } from "vue-router";
import { createAuthGuard } from "@auth0/auth0-vue";

import type { App } from "vue";

const router = (app: App) =>
  createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: "/",
        name: "Home",
        component: () => import("@/views/HomeView.vue"),
        beforeEnter: createAuthGuard(app),
      },
      {
        path: "/contract/:id",
        name: "Contract",
        component: () => import("@/views/ContractDetailView.vue"),
        beforeEnter: createAuthGuard(app),
      },
      {
        path: "/add_contract",
        name: "NewContract",
        component: () => import("@/views/NewContractView.vue"),
        beforeEnter: createAuthGuard(app),
      },
      {
        path: "/overview",
        name: "Overview",
        component: () => import("@/views/OverviewView.vue"),
        beforeEnter: createAuthGuard(app),
      },
    ],
  });

export default router;
