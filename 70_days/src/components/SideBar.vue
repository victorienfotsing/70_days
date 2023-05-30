<script setup lang="ts"></script>

<template>
  <div
    class="top-0 right-0 fixed z-10 flex flex-col justify-center items-center min-h-screen h-screen bg-gray-100 rounded dark:bg-gray-800"
    aria-label="Sidebar"
  >
    <div class="flex justify-end w-full px-6">
      <button
        @click="$emit('close')"
        type="button"
        class="text-gray-200 hover:text-white focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:text-gray-300 dark:hover:text-white"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
    <div class="overflow-y-auto w-screen py-8 px-6">
      <slot />
    </div>
  </div>
</template>

<style></style>
