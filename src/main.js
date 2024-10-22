import { createApp } from 'vue';
import { Quasar, Notify } from 'quasar';
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
    plugins: { Notify },
    config: {
      notify: {
        progressClass: 'bg-primary',
        position: 'bottom-right',
        badgeColor: 'primary',
        iconColor: 'black',
        textColor: 'black',
        multiLine: true,
        progress: true,
        color: 'white',
        icon: 'info',
        timeout: 2000,
        html: true,
      },
    },
    lang: es,
  })
  .mount('#app');
