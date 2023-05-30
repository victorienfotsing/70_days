<script setup lang="ts">
import { reactive, ref } from "vue";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import ContractService from "@/services/ContractService";
import { useAuth0 } from "@auth0/auth0-vue";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import debounce from "lodash.debounce";
const emit = defineEmits<{
  (e: "success", contract: any): void;
  (e: "fail"): void;
}>();

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

const auth0 = useAuth0();
const addContract = debounce(async () => {
  const isValid = await form$.value.$validate();
  showSuccessMessage.value = false;
  submitted.value = true;
  if (isValid) {
    ContractService.create({
      name: form$.value.name.$model!.trim(),
      start: form$.value.start.$model!.toISOString(),
      user: auth0.user.value.sub!,
    })
      .then((contract) => {
        emit("success", contract);
        form$.value.$reset();
        showSuccessMessage.value = true;
      })
      .catch(() => {
        emit("fail");
      });
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
        Der Vertrag wurde zu deinen Veträgelisten hinzugefügt!
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
  <form @submit.prevent="addContract()">
    <div class="step-1 py-8">
      <label
        for="contract_name"
        class="block mb-2 font-medium text-gray-900 dark:text-gray-400"
        >Vertragsname</label
      >
      <InputText
        id="contract_name"
        class="w-full"
        placeholder="Vertragsname"
        v-model="form$.name.$model"
        :class="{ 'p-invalid': form$.name.$invalid && submitted }"
      />
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
            <small class="p-error p-p-1">
              {{ error.$message }}
            </small>
          </p>
        </div>
      </Transition>

      <label
        for="contract_start"
        class="block mt-10 mb-2 font-medium text-gray-900 dark:text-gray-400"
        >Vertragsanfang</label
      >
      <Calendar
        v-model="form$.start.$model"
        :max-date="new Date()"
        class="w-full"
        dateFormat="dd.mm.yy"
        placeholder="Vertragsanfang"
        :class="{ 'p-invalid': form$.start.$invalid && submitted }"
      />
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
            <small class="p-error p-p-1">
              {{ error.$message }}
            </small>
          </p>
        </div>
      </Transition>

      <div class="flex mt-10 justify-end">
        <button
          type="submit"
          class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Vertrag hinzufügen
        </button>
      </div>
    </div>
  </form>
</template>
