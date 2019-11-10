import Vue from 'vue';
import VueRouter, {Route} from 'vue-router';
import Notes from '@/views/Notes.vue';
import Login from '@/views/Login.vue';
import {securityService} from '@/shared/services/SecurityService';
import Settings from "@/views/Settings.vue";
import Tips from "@/views/Tips.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: '/notes/archived',
    name: 'archived',
    component: Notes,
    props: {
      archived: true,
    },
    meta: {
      anonymousAllowed: false,
    },
  },
  {
    path: '/notes',
    name: 'notes',
    component: Notes,
    props: {
      archived: false,
    },
    meta: {
      anonymousAllowed: false,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: {
      anonymousAllowed: true,
    },
  },
  {
    path: '/tips',
    name: 'tips',
    component: Tips,
    meta: {
      anonymousAllowed: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      anonymousAllowed: true,
    },
  },
  {
    path: '*',
    redirect: '/notes',
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to: Route, from: Route, next: Function) => {
  if (!to.meta.anonymousAllowed && !securityService.isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});

export default router;
