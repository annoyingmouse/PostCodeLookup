import { Home } from '../modules/home.js';
import { Detail } from '../modules/detail.js';
import { Test } from '../modules/test.js';


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