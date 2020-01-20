<template>
  <div class="registration2">
    <v-dialog max-width="600px" v-model="dialog">
      <template v-slot:activator="{on}">
        <v-btn outlined block color="blue" v-on="on">Registrati</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <h2>Nuovo utente</h2>
          <div v-show="error" class="red--text">{{ error }}</div>
        </v-card-title>
        <v-card-text>
          <div>
            Una password valida deve contenere almeno 8 simboli, tra cui:
            <ul>
              <li>almeno una lettera maiuscola e una minuscola,</li>
              <li>almeno un numero e almeno un carattere speciale.</li>
            </ul>
          </div>

          <v-form ref="form" @submit.prevent="signUp" id="signupForm">
            <v-row>
              <v-col>
                <v-text-field
                  placeholder="Nome"
                  v-model="name"
                  :rules="[rules.required, rules.nameSurname]"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  placeholder="Cognome"
                  v-model="surname"
                  :rules="[rules.required, rules.nameSurname]"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-text-field
              v-model="email"
              placeholder="Email"
              :rules="[rules.required, rules.emailFormat]"
              prepend-icon="mdi-account"
            ></v-text-field>
            <v-text-field
              v-model="password"
              placeholder="Scegli password"
              :rules="[rules.required, rules.passwordFormat]"
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn class="mr-4" color="blue" dark type="submit" form="signupForm">Invia</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { auth } from "@/fb";
import { bus } from "@/main";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dialog: false,
      name: "",
      surname: "",
      email: "",
      password: "",
      re_password: "",
      error: null
    };
  },

  methods: {
    signUp() {
      if (this.$refs.form.validate()) {
        const promise = auth.createUserWithEmailAndPassword(
          this.email,
          this.password
        );
        promise.then(data => {
          data.user.updateProfile({
            displayName: this.name + " " + this.surname
          });
          this.dialog = false;
          this.$refs.form.reset();
          this.error = null;
        });

        // Invio link di verifica email
        promise.then(() => {
          let user = auth.currentUser;

          user.sendEmailVerification().then(() => {
            console.log("Email verification");
            bus.$emit("snackbarVerify", {
              message:
                "Controlla la tua email. Abbiamo inviato un link di verifica all'indirizzo specificato",
              color: ""
            });
          });
        });
        promise.catch(err => (this.error = err.message));
      }
    }
  },
  computed: {
    ...mapGetters({
      rules: "validateFormRules/rules"
    }),
    passwordConfirmationRule() {
      return this.password === this.re_password || "Le password non coincidono";
    }
  }
};
</script>



