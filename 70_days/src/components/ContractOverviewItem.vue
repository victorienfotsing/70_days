<script setup lang="ts">
import { useRouter } from "vue-router";

const props = defineProps<{
  id?: string;
  name: string;
  daysCount: number;
}>();
const router = useRouter();
const openContract = () => {
  if (props.id) {
    router.push({
      name: "Contract",
      params: {
        id: props.id,
      },
    });
  }
};
</script>

<template>
  <div
    class="py-4 p-4 rounded-lg"
    :class="{ 'hover:bg-gray-800 cursor-pointer': props.id }"
    @click="openContract()"
  >
    <div class="mb-1 text-lg font-medium dark:text-white">
      <div class="capitalize">
        {{ props.name }}
      </div>
      <div>{{ daysCount }} / 70 gearbeitet</div>
    </div>
    <div class="w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
      <div
        class="h-6 bg-gray-600 rounded-full dark:bg-gray-300"
        :style="'width:' + (daysCount / 70) * 100 + '%'"
      ></div>
    </div>
  </div>
</template>
