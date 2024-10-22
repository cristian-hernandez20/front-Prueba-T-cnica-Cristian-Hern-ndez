import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { useRouter } from 'vue-router';



export const pinia = createPinia();

const PiniaRouterPlugin = ({ store }) => {
  store.$router = useRouter();
};
pinia.use(PiniaRouterPlugin);
pinia.use(piniaPluginPersistedstate);
