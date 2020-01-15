import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { auth } from "@/fb";
import store from "./store/";
import vuetify from './plugins/vuetify';
import { db } from './fb';

export const bus = new Vue();

Vue.config.productionTip = false
auth.languageCode = 'it';



auth.onAuthStateChanged(user => {

  // Dispatch dell'action initialize per mostrare la schermata di login
  store.dispatch("authentication/act_initialize", user);
  if (user) {
    if (user.emailVerified) {
      // Se l'email è verificata, controllo la presenza di custom claims
      user.getIdTokenResult().then(IdTokenResult => {
        user.admin = IdTokenResult.claims.admin;
        // Scrivo i dati utente su store
        store.dispatch("authentication/act_fetchUser", user);

        // Controllo se l'utente è iscritto al corso
        let docRef = db.collection("students").doc(user.uid);
        docRef.get().then(doc => {
          store.dispatch("authentication/act_SET_ENROLLED", doc.exists);
        })
        if (user.admin) {
          router.replace({ name: "adminPanel" }).catch(err => console.log(err.message));
        } else {
          router.replace({ name: "home" }).catch(err => console.log(err.message));
        }


      });


    } else {
      // Se l'email non è verificata, invio un link di verifica
      console.log("Email non verificata");
      /*user
        .sendEmailVerification()
        .then(() => {
          console.log("Email verification");
          alert("Controlla la tua casella di posta. Abbiamo inviato un link di verifica all'indirizzo specificato");
        });*/
    }
  }

});




new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
