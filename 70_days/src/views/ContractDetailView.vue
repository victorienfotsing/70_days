<script setup lang="ts">
import dayjs from "dayjs";
import ContractService from "@/services/ContractService";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/stores/contract";
import { computed, reactive, ref } from "vue";
import Calendar from "primevue/calendar";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import debounce from "lodash.debounce";

const route = useRoute();
const router = useRouter();
const id = route.params.id.toString();

const form: {
  name: string | undefined;
  start: Date | undefined;
} = reactive({
  name: undefined,
  start: undefined,
});
const formValidationRules = {
  name: {
    required: helpers.withMessage(
      "Der Vertragsname ist erforderlich!",
      required
    ),
  },
  start: {
    required: helpers.withMessage(
      "Das Datum des Vertragsanfangs ist erforderlich!",
      required
    ),
  },
};
const form$ = useVuelidate(formValidationRules, form);

const showSuccessMessage = ref(false);
const submitted = ref(false);

if (id) {
  useStore()
    .fetchCurrentContract(id)
    .then(() => {
      const ct = useStore().currentContract;
      form.name = ct?.name;
      form.start = ct ? new Date(ct.start) : undefined;
    });
}
const contract = computed(() => useStore().currentContract);
const days = computed(() => useStore().currentContract?.days ?? []);
const deleteDay = debounce(async (day: string) => {
  const daysCopy = [...(contract.value?.days ?? [])];

  if (daysCopy.length > 0) {
    const tmpDays = daysCopy.filter((d) => d !== day);
    if (daysCopy.length !== tmpDays.length) {
      await ContractService.update(id, {
        days: tmpDays,
      }).then(() => {
        if (contract.value) contract.value.days = tmpDays;
      });
    }
  }
}, 150);

const updateContract = debounce(async () => {
  const isValid = await form$.value.$validate();
  showSuccessMessage.value = false;
  submitted.value = true;
  if (isValid && id) {
    await ContractService.update(id, {
      name: form$.value.name.$model!.trim(),
      start: form$.value.start.$model!.toISOString(),
    }).then(() => {
      form$.value.$reset();
      showSuccessMessage.value = true;
    });
  }
}, 150);

const deleteContract = debounce(async () => {
  if (id) {
    await ContractService.delete(id).then(async () => {
      await router.push({ name: "Overview" });
    });
  }
}, 150);
</script>

<template>
  <form @submit.prevent="updateContract()" v-if="contract">
    <Transition name="notification" :duration="150">
      <div
        id="alert-border-3"
        class="flex p-4 mb-4 bg-green-100 border-t-4 border-green-500 dark:bg-green-200"
        role="alert"
        v-if="showSuccessMessage"
      >
        <svg
          class="flex-shrink-0 w-5 h-5 text-green-700"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <div class="ml-3 text-sm font-medium text-green-700">
          Der Vertrag wurde aktualiesiert!
        </div>
        <button
          type="button"
          class="ml-auto -mx-1.5 -my-1.5 bg-green-100 dark:bg-green-200 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 dark:hover:bg-green-300 inline-flex h-8 w-8"
          data-dismiss-target="#alert-border-3"
          aria-label="Close"
          @click="showSuccessMessage = false"
        >
          <span class="sr-only">Dismiss</span>
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </Transition>
    <div class="text-right mb-7">
      <button
        @click.prevent="deleteContract()"
        class="mr-3 dark:bg-gray-700/30 dark:hover:bg-gray-700 dark:text-white rounded-full md:rounded-lg text-center align-middle font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Vertrag löschen
      </button>
      <button
        @click.prevent="updateContract()"
        v-if="form$.$anyDirty"
        type="submit"
        class="text-white disabled:bg-slate-50 disabled:bg-gradient-to-r disabled:from-gray-500 disabled:to-gray-500 bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Änderungen Speichern
      </button>
    </div>
    <div class="mb-5">
      <div class="relative">
        <input
          type="text"
          name="price"
          id="price"
          v-model="form$.name.$model"
          class="block w-full rounded border-gray-800 pl-4 p-3 focus:border-gray-500 focus:ring-gray-300"
          placeholder="Vertragsname"
          :class="{ 'p-invalid': form$.name.$invalid }"
        />
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <span class="text-gray-500 sm:text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="h-5 w-5 m-auto"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
          </span>
        </div>
      </div>

      <Transition name="notification" :duration="150">
        <div
          v-if="form$.name.$invalid || form$.name.$pending"
          class="col-12 md:col-offset-3 md:col-9"
        >
          <p
            v-for="(error, index) in form$.name.$errors"
            :key="index"
            class="mb-1"
          >
            <small class="text-red-500">
              {{ error.$message }}
            </small>
          </p>
        </div>
      </Transition>
    </div>
    <div class="mb-5">
      <div class="relative">
        <Calendar
          v-model="form$.start.$model"
          :max-date="new Date()"
          class="w-full bg-black"
          dateFormat="dd.mm.yy"
          placeholder="Vertragsanfang"
          :class="{ 'p-invalid': form$.start.$invalid }"
        />
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <span class="text-gray-500 sm:text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="h-5 w-5 m-auto"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
          </span>
        </div>
      </div>
      <Transition name="notification" :duration="150">
        <div
          v-if="form$.start.$invalid || form$.start.$pending"
          class="col-12 md:col-offset-3 md:col-9"
        >
          <p
            v-for="(error, index) in form$.start.$errors"
            :key="index"
            class="mb-1"
          >
            <small class="text-red-500">
              {{ error.$message }}
            </small>
          </p>
        </div>
      </Transition>
    </div>
    <table class="table-auto w-full border-collapse dark:text-white">
      <thead>
        <tr>
          <th class="text-left py-2">Days ({{ days.length }} / 70)</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
          <tr
            v-for="(day, index) in days"
            :key="index"
            class="border-b border-slate-400"
          >
            <td class="p-2">{{ dayjs(day).format("DD.MM.YYYY") }}</td>
            <td class="p-2">
              <div class="float-right">
                <button
                  @click.prevent="deleteDay(day)"
                  class="p-2 dark:bg-gray-700/30 dark:hover:bg-gray-700 dark:text-white rounded-full md:rounded-lg text-center align-middle"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
      </tbody>
    </table>
  </form>
</template>
