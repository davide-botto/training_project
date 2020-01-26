import Vue from 'vue';
import Vue2TouchEvents from 'vue2-touch-events';
import App from './App.vue';
import router from './router';
import { auth } from "@/fb";
import store from "./store/";
import vuetify from './plugins/vuetify';
import { db } from './fb';



export const bus = new Vue();

Vue.config.productionTip = false;

/**-------------------------------------------------------
 * **** LISTENER CAMBI DELLO STATO DI AUTENTICAZIONE *****
  ---------------------------------------------------------*/
auth.onAuthStateChanged(user => {

  // ******* Dispatch dell'action initialize per mostrare la schermata di login ******** //
  store.dispatch("authentication/act_initialize", user);
  if (user) {
    if (user.emailVerified) {
      // ------- Se l'email è verificata, controllo la presenza di custom claims -------- //
      user.getIdTokenResult().then(IdTokenResult => {
        user.admin = IdTokenResult.claims.admin;
        //------- Scrivo i dati utente su store ------- //
        store.dispatch("authentication/act_fetchUser", user);

        //-------- Controllo se l'utente è iscritto al corso --------- //
        let docRef = db.collection("students").doc(user.uid);
        docRef.get().then(doc => {
          store.dispatch("authentication/act_SET_ENROLLED", doc.exists);
        }).catch(err => console.log(err.message));

        let routeBeforeRefresh = localStorage.getItem('name');
        
        // -------- Se l'utente ha fatto un refresh senza fare logout, lo riporto sulla vista -------- //
        if (routeBeforeRefresh) {
          router.replace({ name: routeBeforeRefresh });
        }
        else { 
          /** ----- Altrimenti vado alla home:
           I profili normal user e admin hanno due home differenti -------*/
          
          if (user.admin) {
            router.replace({ name: "adminPanel" }).catch(err => console.log(err.message));
          } else {
            router.replace({ name: "home" }).catch(err => console.log(err.message));
          }
        }
   
      });


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
