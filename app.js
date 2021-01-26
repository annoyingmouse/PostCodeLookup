import { router } from './router/router.js';

Vue.config.devtools = true

Vue.use(VueRouter)

new Vue({
  el: '#app',
  router
})