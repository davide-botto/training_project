import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { auth } from "@/fb";
import store from "./store/";
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

auth.onAuthStateChanged(user => {
  if (user) {
    // Dispatch della action "fetchUser"
    if (user.emailVerified) {
      console.log("Login Success");
      // Se l'utente è logged-in, accedo ai custom claims
      user.getIdTokenResult().then(idTokenResult => {
        // Aggiungo la proprietà admin a user
        user.admin = idTokenResult.claims.admin;
        // Dispatch della action "fetchUser"
        store.dispatch("fetchUser", user);

      });
    } else {
      console.log("Email not verified");
      store.dispatch("fetchUser", user);
    }

  } else {
    console.log("Not logged in");

  }
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
