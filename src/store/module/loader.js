import { defineStore } from 'pinia';

export const useModuleLoader = defineStore('loader', {
  state: () => ({
    loader: false,
  }),
  getters: {},
  actions: {
    setLoader$(loader) {
      this.loader = loader;
    },
  },
});
