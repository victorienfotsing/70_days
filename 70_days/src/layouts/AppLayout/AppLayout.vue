<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { useRouter } from "vue-router";
const auth0 = useAuth0();
const router = useRouter();

const { user } = auth0;
const logout = () => auth0.logout();
</script>
<template>
  <div class="px-8 py-4 flex justify-center items-center min-h-screen">
    <div class="min-w-full">
      <div class="py-4">
        <slot />
      </div>
    </div>
  </div>
  <div class="sticky bottom-0 px-8 dark:bg-slate-800 mt-4 z-40">
    <div class="flex align-center content-between justify-between">
      <div class="flex items-center space-x-4 py-3">
        <button
          @click="router.push({ name: 'Overview' })"
          class="p-2 dark:bg-gray-700/30 dark:hover:bg-gray-700 dark:text-white rounded-full md:rounded-lg text-center align-middle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 m-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <span class="px-3 hidden md:inline-block"> Übersicht </span>
        </button>
        <button
          type="button"
          @click="router.push({ name: 'Home' })"
          class="p-2 dark:bg-gray-700/30 dark:hover:bg-gray-700 dark:text-white rounded-full md:rounded-lg text-center align-middle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 m-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span class="px-3 hidden md:inline-block">
            Arbeitstag hinzufügen
          </span>
        </button>
        <button
          @click="router.push({ name: 'NewContract' })"
          class="p-2 dark:bg-gray-700/30 dark:hover:bg-gray-700 dark:text-white rounded-full md:rounded-lg text-center align-middle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 m-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span class="px-3 hidden md:inline-block"> Vertrag hinzufügen </span>
        </button>
      </div>
      <div class="flex items-center space-x-4 p-6" v-if="user">
        <button
          @click="logout()"
          class="p-2 dark:bg-gray-700/20 dark:hover:bg-gray-700/50 dark:text-white rounded-full md:rounded-lg text-center align-middle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6 m-auto"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>

          <span class="px-3 hidden md:inline-block"> Ausloggen </span>
        </button>

        <img
          class="w-8 h-8 rounded-full right-0"
          :src="user.picture"
          alt="profile"
        />
        <div class="space-y-1 font-small dark:text-white hidden lg:block">
          <div>{{ user.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
