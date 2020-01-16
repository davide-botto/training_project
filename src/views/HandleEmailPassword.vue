<template>
  <div>
    <v-app-bar>
      <v-toolbar-title class="blue--text">{{title}}</v-toolbar-title>
    </v-app-bar>
    
    <!-- Form per resettare la password -->
    <v-card v-if="resetForm">
      <v-card-text>
          <div v-show="error" class="red--text">{{error}}</div>
        <v-form id="resetPasswordForm" @submit.prevent="submitResetRequest" ref="form">
          <v-text-field
            v-model="newPassword"
            placeholder="Nuova password"
            :rules="[rules.required, rules.content]"
            type="password"
          ></v-text-field>
          <v-text-field
            v-model="re_newPassword"
            placeholder="Ripeti nuova password"
            :rules="[rules.required,  passwordConfirmationRule]"
            type="password"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn type="submit" form="resetPasswordForm">Invia</v-btn>
      </v-card-actions>
    </v-card>
  
    <!-- Messaggio di verifica eamil -->
    <v-card v-else-if="verificationMessage" class="text-center">
        <resendEmail v-if="error" :dialogProps="dialogProps"/>
        <h2 v-else>Il tuo indirizzo email è stato verificato, vai alla pagina di login. </h2>
    </v-card>
    <!-- Snackbar con il messaggio di password resettata -->
    <Snackbar :snackbarProps="snackbarProps" />
  </div>
</template>
<script src="https://www.gstatic.com/firebasejs/7.6.2/firebase.js"></script>


<script>
import {auth} from "@/fb";
import Snackbar from "../components/Snackbar";
import resendEmail from "../components/resendEmail";
import {bus} from "@/main"

export default {
  data() {
    return {
      resetForm: false,
      verificationMessage: false,
      error: null,
      mode: "",
      actionCode: "",
      title: "",
      newPassword: "",
      re_newPassword: "",
      rules: {
        required: value => !!value || "Campo necessario",
        /**Regole Password:
         * almeno 8 simboli
         * almeno una lettera minuscola
         * almeno una lettera maiuscola
         * almeno un numero
         * almeno un carattere speciale
         */
        content: v =>
          /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W)(?=.*[^ ]).*$/.test(
            v
          ) || "Formato password non valido"
      },
      snackbarProps: {
        message: "Password modificata correttamente. Vai alla pagina di login",
        color: "success"
      },
      dialogProps: {
        title: "Email non verificata",
        message: ""
      }
    };
  },
  created() {
    this.mode = this.getParameterByName("mode");
    this.actionCode = this.getParameterByName("oobCode");
    switch (this.mode) {
      case "resetPassword":
        console.log("Resetta la password");
        this.title = "Reset password";
        this.resetForm = true;
        //this.handleResetPassword(actionCode);
        break;
      case "verifyEmail":
        console.log("Verifica email");
        this.title = "Verifica email"
        this.handleVerifyEmail(this.actionCode);
        break;
    }
  },
  methods: {
    getParameterByName(name) {
      if (name !== "" && name !== null && name != undefined) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
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
      let accountEmail;
      auth
        .verifyPasswordResetCode(actionCode)
        .then(email => {
          console.log("Password reset for " + email);
          auth
            .confirmPasswordReset(actionCode, newPassword)
            .then(() => {
              console.log("Password modificata correttamente");
              
              bus.$emit("snackbarMessage");
              this.$refs.form.reset();
            })
            .catch(err => {
                // Errore in confirmPasswordReset
                console.log(err.message);
                this.error = "Errore durante la conferma del reset password. Ripeti la richiesta di reset."});
        })
        .catch(err => {
            // Codice non valido o scaduto.
            console.log(err.message);
            this.error = "Il codice di reset password non è valido, oppure è scaduto. Ripeti la richiesta di reset."});
    },

    handleVerifyEmail(actionCode) {
        auth.applyActionCode(actionCode)
        .then(() => {
            console.log("Il tuo indirizzo email è stato verificato");
            this.verificationMessage = true;
        })
        .catch(err => {
            console.log(err.message);
            this.error = "Il codice di verifica non è valido, oppure è scaduto.";
            this.dialogProps.message = this.error;

        })
    },
    submitResetRequest() {
      this.handleResetPassword(this.actionCode, this.newPassword);
    }
  },
  computed: {
    passwordConfirmationRule() {
      return (
        this.newPassword === this.re_newPassword || "Le password non coincidono"
      );
    }
  },
  components: {
      Snackbar,
      resendEmail
  }
};
</script>
