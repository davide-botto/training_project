import Vue from 'vue';
import Vue2TouchEvents from 'vue2-touch-events';
import App from './App.vue';
import router from './router';
import { auth } from "@/fb";
import store from "./store/";
import vuetify from './plugins/vuetify';
import { db } from './fb';


export const bus = new Vue();

Vue.config.productionTip = false
auth.languageCode = 'it';

/**------------------------------------------------------------------
 * ******** Redirige l'utente alla vista corrente o alla home ********
 --------------------------------------------------------------------*/

function redirectView(user) {
  let routeBeforeRefresh = localStorage.getItem('name');

  // -------- Se l'utente ha fatto un refresh senza fare logout, lo riporto sulla vista -------- //
  if (routeBeforeRefresh) {
    router.replace({ name: routeBeforeRefresh });
  } else {
    /** ----- Altrimenti vado alla home:
     I profili normal user e admin hanno due home differenti -------*/

    console.log(user.admin)
    if (user.admin) {
      router.replace({ name: "adminPanel" }).catch(err => console.log(err.message));
    } else {
      router.replace({ name: "home" }).catch(err => console.log(err.message));
    }
  }
}

/**---------------------------------------------------------------------
 * ********* Listener dei cambi dello stato di autenticazione **********
 ----------------------------------------------------------------------*/
auth.onAuthStateChanged(user => {

  // ******* Dispatch dell'action initialize per mostrare la schermata di login ******* //
  store.dispatch("authentication/act_initialize", user);
  if (user) {

    //******** L'utente accede con metodo email-password: l'email deve essere verificata ********/
    if (user.emailVerified) {

      // ****** Se l'email è verificata, controllo la presenza di custom claims ****** //
      user.getIdTokenResult().then(IdTokenResult => {
        user.admin = IdTokenResult.claims.admin;

        // ****** Scrivo i dati utente su store ****** //
        store.dispatch("authentication/act_fetchUser", user);

        // ******* Controllo se l'utente è iscritto al corso ******* //
        let docRef = db.collection("students").doc(user.uid);
        docRef.get().then(doc => {
          store.dispatch("authentication/act_SET_ENROLLED", doc.exists);
        }).catch(err => console.log(err.message));

        redirectView(user);
      });



    } else {
      // ****** Se l'utente accede con Facebook, emailVerified è false. ****** //
      if (user.providerData[0].providerId === 'facebook.com') {

        //****** Registro lo user come logged in e il metodo di sign in come "account" *******/
        store.dispatch("authentication/act_fetchUser", user);
        store.dispatch("authentication/act_SET_SIGN_IN_METHOD", "account");

        redirectView(user);
      }
    }
  }

});


Vue.use(Vue2TouchEvents);

new Vue({
  router,
  store,
  vuetify,
  Vue2TouchEvents,
  render: h => h(App)
}).$mount('#app')