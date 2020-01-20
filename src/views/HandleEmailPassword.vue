<template>
  <div>
    <v-app-bar>
      <v-toolbar-title class="blue--text">{{title}}</v-toolbar-title>
    </v-app-bar>

    <!-- ****** Form per resettare la password ****** -->
    <v-container v-if="resetForm">
      <v-row justify="center">
        <v-col align="center">
          <v-card max-width="600">
            <v-card-text class="text-left">
              <div v-show="error" class="red--text">{{error}}</div>
              <div>
                Una password valida deve contenere almeno 8 simboli, tra cui:
                <ul>
                  <li>almeno una lettera maiuscola e una minuscola,</li>
                  <li>almeno un numero e almeno un carattere speciale.</li>
                </ul>
              </div>

              <v-form id="resetPasswordForm" @submit.prevent="submitResetRequest" ref="form">
                <!-- Inserisci nuova password -->
                <v-text-field
                  v-model="newPassword"
                  placeholder="Nuova password"
                  :rules="[rules.required, rules.content]"
                  type="password"
                ></v-text-field>
                <!-- Ripeti nuova password -->
                <v-text-field
                  v-model="re_newPassword"
                  placeholder="Ripeti nuova password"
                  :rules="[rules.required,  passwordConfirmationRule]"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn type="submit" form="resetPasswordForm" outlined color="blue">Invia</v-btn>
            </v-card-actions>
            <!-- Se il reset password va a buon fine, mostro il link per tornare alla pagina di login -->
            <a v-if="show" href="http://localhost:8080/">Torna al login</a>  
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- ****** Messaggio di verifica email ****** -->
    <v-container v-else-if="verificationMessage && !error">
      <v-row justify="center">
        <v-col align="center">
          <v-card class="text-center" max-width="800">
            <v-card-text>
              <h2>Il tuo indirizzo email è stato verificato, torna alla pagina di login.</h2>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- ****** Messaggio di errore ****** -->
    <v-card v-else-if="error">
      <v-card-text class="text-center red--text">
        <h2>{{error}}</h2>
      </v-card-text>
    </v-card>
    <!-- Se la verifica email ha dato errore, mostro un dialog che consente di reinviare il link -->
    <resendEmail />
  </div>
</template>



<script>
import { auth } from "@/fb";
import resendEmail from "../components/resendEmail";
import { bus } from "@/main";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      resetForm: false,
      verificationMessage: false,
      error: null,
      mode: "",
      actionCode: "",
      title: "",
      email: "",
      newPassword: "",
      re_newPassword: "",
      show: false,
    };
  },
  created() {
    // Leggo mode e actionCode dall'url
    this.mode = this.getParameterByName("mode");
    this.actionCode = this.getParameterByName("oobCode");
    switch (this.mode) {
      case "resetPassword":
        // Nel mode reset password compare un form che consente di reimpostarla
        console.log("Resetta la password");
        this.title = "Reset password";
        this.resetForm = true;
        break;
      case "verifyEmail":
        // nel mode verify email compare un messaggio di avviso
        console.log("Verifica email");
        this.title = "Verifica email";
        this.handleVerifyEmail(this.actionCode);
        break;
    }
  },
  methods: {
    // Ricava un parametro dall'url dato il nome
    getParameterByName(name) {
      if (name !== "" && name !== null && name != undefined) {
        name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
        return results === null
          ? ""
          : decodeURIComponent(results[1].replace(/\+/g, " "));
      } else {
        var arr = location.href.split("/");
        return arr[arr.length - 1];
      }
    },
    handleResetPassword(actionCode, newPassword) {
      // Verifico il codice di reset password
      auth
        .verifyPasswordResetCode(actionCode)
        .then(email => {
          console.log("Password reset for " + email);
          // Confermo il reset
          auth
            .confirmPasswordReset(actionCode, newPassword)
            .then(() => {
              // Se il reset va a buon fine mostro uno snackbar con un messaggio di successo
              console.log("Password modificata correttamente");

              bus.$emit("snackbarUpdate", {
                message:
                  "Password modificata correttamente. Vai alla pagina di login",
                color: "success"
              });
              this.$refs.form.reset();
              // Mostro il link per tornare alla pagina di login
              this.show = true;
            })
            .catch(err => {
              // Errore in confirmPasswordReset: mostro un messaggio in card
              console.log(err.message);
              this.error =
                "Errore durante la conferma del reset password. Ripeti la richiesta di reset.";
            });
        })
        .catch(err => {
          // Codice non valido o scaduto: mostro un messaggio in card
          console.log(err.message);
          this.error =
            "Il codice di reset password non è valido, oppure è scaduto. Ripeti la richiesta di reset.";
        });
    },

    handleVerifyEmail(actionCode) {
      auth
        .applyActionCode(actionCode)
        .then(() => {
          // Se l'email viene verificata, mostro un messaggio in card
          console.log("Il tuo indirizzo email è stato verificato");
          this.verificationMessage = true;
        })
        .catch(err => {
          // Se non viene verificata mostro un messaggio in card
          console.log(err.message);
          this.error = "Il codice di verifica non è valido, oppure è scaduto.";
          // Apro il dialog per reinviare una mail di verifica
          bus.$emit("openResendEmail", {
            title: "Email non verificata",
            message:
              "Controlla nella spam, altrimenti reinvia una mail di verifica."
          });
        });
    },
    submitResetRequest() {
      // Procedo solo se sono rispettate le regole di validazione
      if (this.$refs.form.validate()) {
        this.handleResetPassword(this.actionCode, this.newPassword);
      }
    }
  },
  computed: {
    ...mapGetters({
      // map `this.user` to `this.$store.getters.user`
      rules: "validateFormRules/rules"
    }),

    passwordConfirmationRule() {
      // Verifico che le password nei campi "Nuova password" e "Ripeti coincidano"
      return (
        this.newPassword === this.re_newPassword || "Le password non coincidono"
      );
    }
  },
  components: {
    resendEmail
  }
};
</script>
