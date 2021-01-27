import { Home } from '../modules/home.js';
import { Detail } from '../modules/detail.js';

export const router = new VueRouter({
  routes: [
    { 
      path: '/', 
      name: 'home', 
      component: Home 
    },
    { 
      path: '/:postcode', 
      name: 'detail', 
      component: Detail
    },
  ]
})