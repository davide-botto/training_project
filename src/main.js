import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { auth } from "@/fb";
import store from "./store/";
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
auth.languageCode = 'it';


auth.onAuthStateChanged(user => {
  if (user) {
    console.log(user.emailVerified);
    if (user.emailVerified) {
      // Se l'email è verificata, controllo la presenza di custom claims
      user.getIdTokenResult().then(IdTokenResult => {
        user.admin = IdTokenResult.claims.admin
      });
      store.dispatch("authentication/fetchUser", user);
      router.replace({name: "home"}).catch(err => console.log(err.message));
    } else {
      // Se l'email non è verificata, invio un link di verifica
      user
        .sendEmailVerification()
        .then(() => {
          console.log("Email verification");
          alert("Controlla la tua casella di posta. Abbiamo inviato un link di verifica all'indirizzo specificato");
        });
    }
  }

});




new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
