import { createApp } from 'vue';
import { Quasar } from 'quasar';
import es from 'quasar/lang/es';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import App from './App.vue';
import router from './router';
import { pinia } from './store';

const app = createApp(App);

app
  .use(router)
  .use(pinia)
  .use(Quasar, {
    config: {
      brand: {},
      dark: 'auto',
    },
    lang: es,
    plugins: {},
  })
  .mount('#app');
