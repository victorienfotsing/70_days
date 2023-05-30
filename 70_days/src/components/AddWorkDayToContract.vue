<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import debounce from "lodash.debounce";
import Dropdown from "primevue/dropdown";
import { useStore } from "@/stores/contract";
import { useRouter } from "vue-router";
import Calendar from "primevue/calendar";
import ContractService from "@/services/ContractService";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const contracts = computed(() => useStore().contracts);
const form: {
  currentContract: string | undefined;
  days: Date[];
} = reactive({
  currentContract: contracts.value[0]?.id,
  days: [new Date()],
});
const formValidationRules = {
  currentContract: {
    required: helpers.withMessage(
      "Ein Vertrag muss ausgewählt werden!",
      required
    ),
  },
  days: {
    required: helpers.withMessage(
      "Mind. ein Arbeitstag muss ausgewählt sein!",
      (val: Date[]) => val && val.length > 0
    ),
  },
};
const form$ = useVuelidate(formValidationRules, form);
const showSuccessMessage = ref(false);
const submitted = ref(false);
const router = useRouter();
const emit = defineEmits(["success", "fail"]);

const addContract = () => {
  router.push({ name: "NewContract" });
};

const save = debounce(async () => {
  const isValid = await form$.value.$validate();
  showSuccessMessage.value = false;
  submitted.value = true;
  if (isValid) {
    ContractService.addDays(
      form.currentContract!,
      form.days.map((d) => d.toISOString())
    )
      .then(() => {
        emit("success");
        form$.value.$reset();
        showSuccessMessage.value = true;
        submitted.value = false;
      })
      .catch(() => {
        emit("fail");
      });
  } else {
    emit("fail");
  }
}, 150);
</script>

<template>
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
        Deine Eingaben wurden gespeichert !
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
  <form @submit.prevent="save()">
    <div class="step-1 py-8">
      <label
        for="contracts"
        class="block mb-2 font-medium text-gray-900 dark:text-gray-400"
        >Vertrag auswählen</label
      >
      <Dropdown
        class="w-full"
        v-model="form.currentContract"
        id="contracts"
        :options="contracts"
        optionLabel="name"
        optionValue="id"
        placeholder="Vertrag auswählen"
        :class="{ 'p-invalid': form$.currentContract.$invalid && submitted }"
        emptyMessage="Keine Verträge vorhanden!"
      >
      </Dropdown>

      <Transition name="notification" :duration="150">
        <div
          v-if="
            form$.currentContract.$invalid || form$.currentContract.$pending
          "
          class="col-12 md:col-offset-3 md:col-9"
        >
          <p
            v-for="(error, index) in form$.currentContract.$errors"
            :key="index"
            class="mb-1"
          >
            <small class="p-error p-p-1">
              {{ error.$message }}
            </small>
          </p>
        </div>
      </Transition>

      <label
        for="days"
        class="block mt-10 mb-2 font-medium text-gray-900 dark:text-gray-400"
        >Arbeitstagen</label
      >
      <Calendar
        id="days"
        v-model="form.days"
        selectionMode="multiple"
        :manualInput="false"
        class="w-full"
        dateFormat="dd.mm.yy"
        :class="{ 'p-invalid': form$.days.$invalid && submitted }"
      />
      <Transition name="notification" :duration="150">
        <div
          v-if="form$.days.$invalid || form$.days.$pending"
          class="col-12 md:col-offset-3 md:col-9"
        >
          <p
            v-for="(error, index) in form$.days.$errors"
            :key="index"
            class="mb-1"
          >
            <small class="p-error p-p-1">
              {{ error.$message }}
            </small>
          </p>
        </div>
      </Transition>

      <div class="flex mt-10 justify-end">
        <button
          @click.prevent="save()"
          type="submit"
          class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Arbeitstagen hinzufügen
        </button>
      </div>
    </div>
  </form>
</template>
