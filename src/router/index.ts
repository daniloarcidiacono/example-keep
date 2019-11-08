import Vue from 'vue';
import VueRouter from 'vue-router';
import Notes from "@/views/Notes.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: '/notes/archived',
    name: 'archived',
    component: Notes,
    props: {
      archived: true
    }
  },
  {
    path: '/notes',
    name: 'notes',
    component: Notes,
    props: {
      archived: false
    }
  },
  {
    path: '*',
    redirect: '/notes'
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
