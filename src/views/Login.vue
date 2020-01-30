<template>
  <!-- <div class="login" ref="div"> -->
  <v-app id="inspire">
    <TopBar />
    <v-content>
      <v-container class="fill-height bg" fluid>
        <v-row align="center" justify="center" no-gutters>
          <v-col>
            <v-row align="center" justify="center">
              <v-card class="elevation'12 v-flex">
                <div
                  align="center"
                  z-index="2"
                  v-if="user.message"
                >Arrivederci, sei stato logged out</div>
                <v-card-title>
                  <h2>Accedi</h2>
                </v-card-title>
                <v-card-text class="text-center">
                  <div v-show="error" class="red--text">{{ error }}</div>
                  <v-form ref="form" @submit.prevent="login" id="login-form">
                    <v-text-field
                      v-model="email"
                      placeholder="Email"
                      :rules="[rules.required, rules.emailFormat]"
                      prepend-icon="mdi-account"
                    ></v-text-field>
                    <v-text-field
                      v-model="password"
                      placeholder="Password"
                      :rules="[rules.required, rules.passwordFormat]"
                      prepend-icon="mdi-lock"
                      type="password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-container>
                    <v-row>
                      <v-col cols="6">
                        <v-btn block color="blue" dark form="login-form" type="submit">LOGIN</v-btn>
                      </v-col>
                      <v-col cols="6">
                        <SignUp />
                      </v-col>

                      <!-- ******* Button per l'accesso con account (Google, altri da implementare) ******** -->
                      <v-col cols="12" align="center">
                        <v-btn router to="/signInWithAccounts">Accedi con account</v-btn>
                      </v-col>
                      <v-col cols="12">
                        <v-btn block @click="inputDialog = true">Hai dimenticato la password?</v-btn>
                      </v-col>
                    </v-row>
                    <v-row></v-row>
                  </v-container>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <!-- ******* Form di reset password ********* -->
    <v-dialog v-model="inputDialog" max-width="400px">
      <v-card class="d-flex justify center">
        <v-card-title>
          <h3>Reset password</h3>
          <div v-show="error" class="red--text">{{ error }}</div>
          <v-card-text>
            <p>Inserisci il tuo indirizzo email</p>
            <v-form ref="form" id="resetPasswordForm" @submit.prevent="resetPassword">
              <v-text-field
                v-model="resetEmail"
                placeholder="Email"
                :rules="[rules.required, rules.emailFormat]"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn class="success" dark @click="resetPassword" form="resetPasswordForm">Invia</v-btn>
          </v-card-actions>
        </v-card-title>
      </v-card>
    </v-dialog>
    <resendEmail />
  </v-app>
</template>

<script>
import { auth } from "@/fb";
import { bus } from "@/main";
import SignUp from "../components/SignUp";
import TopBar from "../components/TopBar";
import resendEmail from "../components/resendEmail";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      email: "",
      resetEmail: "",
      password: "",
      error: null,
      inputDialog: false,
      passwordDialog: false,
      provider: null
    };
  },
  methods: {
    login() {
      // ******** Invio il form di login solo se sono rispettate le regole di validazione ********* //
      if (this.$refs.form.validate()) {
        this.$store.dispatch("authentication/act_triggerMessage", false);
        auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(user => {
            if (user) {
              // ******** Dopo il login, controllo se l'email fornita è stata verificata ******** //
              if (user.user.emailVerified) {
                console.log("Email verificata");
              } else {
                this.error = "Email non verificata";

                // ******* Se l'email non è verificata, apro il popup per il reinvio ******** //
                bus.$emit("openResendEmail", {
                  title: "Email non verificata",
                  message:
                    "Controlla nella spam, altrimenti reinvia una mail di verifica."
                });
              }
            }
          })
          .catch(err => {
            // ******* Gestisco gli errori di login ******* //
            let errorCode = err.code;
            switch (errorCode) {
              case "auth/invalid-email":
                this.error = "Indirizzo email non valido";
                break;
              case "auth/user-not-found":
                this.error =
                  "Non è stato trovato un utente corrispondente a questo indirizzo email";
                break;
              case "auth/user-disabled":
                this.error =
                  "L'utente corrispondente a questo indirizzo email è stato disabilitato";
                break;
              case "auth/wrong-password":
                this.error = "Password errata";
                break;
            }
          });
      }
    },
    resetPassword() {
      if (this.$refs.form.validate()) {
        // ******** Il backend invia una mail con un link di reset ******** //
        auth
          .sendPasswordResetEmail(this.resetEmail)
          .then(() => {
            console.log("Emit");
            // ******* Mostro uno snackbar con un messaggio ******** //
            bus.$emit("snackbarResetPass", {
              message:
                "Controlla la tua casella di posta. Abbiamo inviato un link di reset password all'indirizzo specificato",
              color: ""
            });
            this.inputDialog = false;
            this.$refs.form.reset();
          })
          .catch(err => {
            console.log(err.message);
            this.error = "Errore: ripeti la richiesta di reset password.";
          });
      }
    }
  },
  created() {
    this.$store.dispatch("topbar/act_setBar", {
      title: { title1: "Corso di programmazione web", title2: "Sviluppo web" },
      toHome: false,
      exit: false
    });
  },
  computed: {
    ...mapGetters({
      // ********* map `this.user` to `this.$store.getters.user` ********* //
      user: "authentication/user",
      barprop: "topbar/barprop",
      rules: "validateFormRules/rules"
    })
  },
  components: {
    TopBar,
    SignUp,
    resendEmail
  }
};
</script>
<style scoped>
/* ********* Carico un'immagine di sfondo sulla schermata di login **********/
.bg {
  background: url("https://www.robotlab.com/hs-fs/hubfs/Code-on-Computer-Hero.gif?width=1200&name=Code-on-Computer-Hero.gif")
    no-repeat center center;
  background-size: cover;
}
</style>