<script setup lang="ts">
import ContractOverviewItem from "@/components/ContractOverviewItem.vue";
import ContractService from "@/services/ContractService";
import { useStore } from "@/stores/contract";
import { computed } from "vue";
import dayjs from "dayjs";
import { useAuth0 } from "@auth0/auth0-vue";

const auth0 = useAuth0();
const { user } = auth0;
if (user.value.sub) {
  useStore().fetch(user.value.sub);
}
const contracts = computed(() => useStore().contracts);
const currentYear = `${dayjs().year()}`;
const days = computed(() =>
  contracts.value
    .filter((contract) => !!contract.days)
    .map((contract) => contract.days)
    .flat(1)
);
</script>

<template>
  <div class="bg-slate-700/80 px-5 py-8 rounded-lg mb-10">
    <ContractOverviewItem
      :name="currentYear"
      :days-count="ContractService.getWorkedDaysInTheCurrentYear(days)"
    />
  </div>
  <ContractOverviewItem
    v-for="(contract, index) in contracts"
    :id="contract.id"
    :name="contract.name"
    :days-count="
      ContractService.getWorkedDays({
        days: contract.days ?? [],
        start: contract.start,
      })
    "
    :key="index"
  />
</template>
