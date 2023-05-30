<script setup lang="ts">
import AddContract from "@/components/AddContract.vue";
import { useStore } from "@/stores/contract";
import { useAuth0 } from "@auth0/auth0-vue";
const auth0 = useAuth0();
const { user } = auth0;

const addSuccess = () => {
  useStore().fetch(user.value.sub!);
};
</script>

<template>
  <AddContract @success="addSuccess()" />
</template>
