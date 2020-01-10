<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:activator="{on}">
      <v-btn outlined class="mr-4" color="blue" v-on="on">Registrati</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <h2>Nuovo utente</h2>
        <div v-show="error" class="red--text">{{ error }}</div>
        <v-card-text>
          <div>
            Una password valida deve contenere almeno 8 simboli, tra cui:
            <ul>
              <li>almeno una lettera maiuscola e una minuscola,</li>
              <li>almeno un numero e almeno un carattere speciale.</li>
            </ul>
          </div>

          <v-form ref="form" @submit.prevent="signUp" id="signupForm">
            <v-text-field
              v-model="email"
              placeholder="Email"
              :rules="[rules.required, rules.emailFormat]"
              prepend-icon="mdi-account"
            ></v-text-field>
            <v-text-field
              v-model="password"
              placeholder="Scegli password"
              :rules="[rules.required, rules.content]"
              type="password"
              prepend-icon="mdi-lock"
            ></v-text-field>
            <!-- Richiedo di ripetere la password e controllo il matching -->
            <v-text-field
              v-model="re_password"
              placeholder="Ripeti password"
              :rules="[passwordConfirmationRule]"
              type="password"
              prepend-icon="mdi-lock"
            ></v-text-field>
            <v-btn class="mr-4" color="blue" dark type="submit" form="signupForm">Invia</v-btn>
          </v-form>
        </v-card-text>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script>
//import {db} from "@/fb";
import { auth } from "@/fb";

export default {
  data() {
    return {
      dialog: false,
      email: "",
      password: "",
      re_password: "",
      error: null,
      rules: {
        emailFormat: v =>
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
            v
          ) || "Format email non valido",
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
      }
    };
  },
  methods: {
    signUp() {
      auth.languageCode = 'it';
      const promise = auth.createUserWithEmailAndPassword(
        this.email,
        this.password
      );
      promise.then(() => {
        this.dialog = false;
        this.$refs.form.reset();
        this.error = null;
      });
      promise.catch(err => (this.error = err.message));
      // verifico l'email dell'utente
      auth.onAuthStateChanged(user => {
        if (user) {
          user
            .sendEmailVerification()
            .then(() => {
              console.log("Email verification");
              alert("Controlla la tua casella di posta. Abbiamo inviato un link di verifica all'indirizzo specificato");
              });
        } else {
          console.log("Not logged in");
        }
      });
    }
  },
  computed: {
    passwordConfirmationRule() {
      return this.password === this.re_password || "Le password non coincidono";
    }
  }
};
</script>



