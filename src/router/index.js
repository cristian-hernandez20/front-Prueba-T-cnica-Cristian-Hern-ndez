import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/:pathMatch(.*)*', redirect: `/home` },
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { title: `Ruleta UNILINK` },
  },
];
const router = createRouter({ history: createWebHistory(process.env.BASE_URL), routes });
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
export default router;
