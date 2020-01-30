<template>
  <div>
    <!-- *** Div per messaggi di errore *** -->
    <div v-show="error" class="red--text">{{ error }}</div>
    <v-btn router to="/">
      <v-icon left>mdi-page-previous</v-icon>back
    </v-btn>

    <v-row justify="center">
      <v-col cols="6" align="center">
        <v-btn color="red" dark @click="signInWithAccount('Google')">
          <v-icon left>mdi-google</v-icon>Google
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6" align="center">
        <v-btn color="indigo" dark @click="signInWithAccount('Facebook')">
          <v-icon left>mdi-facebook-box</v-icon>Facebook
        </v-btn>
      </v-col>
    </v-row>

    <!-- **** Dialog per inserimento password **** -->
    <v-dialog v-model="passwordDialog">
      <v-card>
        <v-card-title>Inserisci la tua password</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              type="password"
              label="Inserisci password"
              v-model="password"
              :rules="[rules.required, rules.passwordFormat]"
              ref="passwordForm"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="sendPassword">Invia</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { auth, providers } from "@/fb";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      password: "",
      passwordDialog: false,
      error: null
    };
  },

  methods: {
    /**-----------------------------------------------------------------
     * *********************** Accedi con Google ***********************
     * -----------------------------------------------------------------*/
    signInWithAccount(account) {
        //this.$store.dispatch("authentication/act_SET_SIGN_IN_METHOD", "account");
        
      if (account === "Google") {
        this.provider = providers[0];
      } else if (account === "Facebook") {
        this.provider = providers[1];
      }

      
      auth.signInWithRedirect(this.provider);
      auth.getRedirectResult()
        .then(result => {
          let user = result.user;
          
          
         console.log(user)
        })

        .catch(err => {
          var errorCode = err.code;
          var pendingCred = err.credential;
          var email = err.email;
          switch (errorCode) {
            case "auth/account-exists-with-different-credential":
              /**----------------------------------------------------------------------
               *  ********* Errore "account-exists-with-different-credential" ********
               * Se abilito l'opzione "One account per email address" su Firebase,
               * quando un utente tenta di fare sign-in con un provider (es Google)
               * usando un'email già adottata per un altro provider (es Facebook),
               * viene generato questo errore con un oggetto "AuthCredential".
               *-----------------------------------------------------------------------*/

              this.error = "Account esistente con credenziali diverse";

              // ****** Richiedo i metodi di sign-in disponibili per l'email ****** //
              auth.fetchSignInMethodsForEmail(email).then(methods => {
                // **** Se ci sono più metodi disponibili, è consigliato il primo **** //
                if (methods[0] === "password") {
                  this.promptUserForPassword()
                    .then(() => {
                      // *** Chiude il dialog *** //
                      this.passwordDialog = false;
                    })
                    .catch(err => console.log(err.message));

                  auth
                    .signInWithEmailAndPassword(email, this.password)
                    .then(function(user) {
                      return user.linkWithCredential(pendingCred);
                    })
                    .then(function() {
                      // *** Account Google agganciato con successo all'utente Firebase *** //
                      console.log("Go To App");
                    });
                }
              });
              break;
            case "auth/auth-domain-config-required":
              this.error =
                "Il dominio di autenticazione non è stato configurato";
              break;
            case "auth/cancelled-popup-request":
              this.error = "Chiamate successive al popup";
              break;
            case "auth/operation-not-allowed":
              this.error = "Account non abilitato";
              break;
            case "auth/operation-not-supported-in-this-environment":
              this.error =
                "Operazione non supportata: location.protocol deve essere http o https";
              break;
            case "auth/popup-blocked":
              this.error = "Popup bloccato";
              break;
            case "auth/popup-closed-by-user":
              this.error =
                "Popup chiuso senza completare l'operazione di accesso";
              break;
            case "auth/unauthorized-domain":
              this.error = "Dominio non autorizzato";
              break;
          }

          console.log(err.message);
        });
    },
    sendPassword() {
      /**** Se le regole di validazione del form sono rispettate
       * restituisce una promise
       */
      if (this.$refs.resetPasswordForm.validate()) {
        return new Promise(resolve => resolve(this.password));
      }
    },
    async promptUserForPassword() {
      this.passwordDialog = true;
      // *** Attende che l'utente invii la password *** //
      await this.sendPassword();
    }
  },
  computed: {
    ...mapGetters({
      // ********* map `this.user` to `this.$store.getters.user` ********* //
      user: "authentication/user",
      barprop: "topbar/barprop",
      rules: "validateFormRules/rules"
    })
  }
};
</script>