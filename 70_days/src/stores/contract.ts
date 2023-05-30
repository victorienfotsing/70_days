import { defineStore } from "pinia";
import type { Contract } from "@/services/ContractService";
import ContractService from "@/services/ContractService";

export const useStore = defineStore("contracts", {
  state: () => {
    return {
      contracts: [] as Contract[],
      currentContract: undefined as Contract | undefined,
    };
  },
  actions: {
    async fetch(user: string) {
      await ContractService.getAll(user).then((docs) => {
        this.contracts = docs;
        return;
      });
    },
    async fetchCurrentContract(id: string) {
      await ContractService.getById(id).then((doc) => {
        this.currentContract = doc;
        return;
      });
    },
  },
});
