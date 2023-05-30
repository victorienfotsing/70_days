<script setup lang="ts">
import { useStore } from "@/stores/contract";
import { useAuth0 } from "@auth0/auth0-vue";
import AppLayout from "@/layouts/AppLayout/AppLayout.vue";
import { watch } from "vue";

const auth0 = useAuth0();
const { user } = auth0;
watch(
  user,
  (newUser) => {
    if (newUser && newUser.sub) {
      useStore().fetch(newUser.sub);
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

<style></style>
