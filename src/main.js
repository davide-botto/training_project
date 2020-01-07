import Vue from 'vue';
import App from './App.vue';
import router from './router';
import {auth} from "@/fb";
import store from "./store/";
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

auth.onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

export const bus = new Vue();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
