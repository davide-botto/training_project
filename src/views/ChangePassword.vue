<template>
  <div>
    <v-app-bar>
      <v-toolbar-title class="blue--text mr-3">Cambio password</v-toolbar-title>
      <v-btn :to="(user.isAdmin) ? '/adminPanel' : '/home'" text>
        <v-icon color="blue">mdi-home</v-icon>
      </v-btn>
    </v-app-bar>
    <v-card>
      <v-card-text>
        <v-form id="changePasswordForm" ref="form">
          <v-text-field
            v-model="currentPassword"
            placeholder="Vecchia password"
            type="password"
            :rules="[rules.required, rules.passwordFormat]"
          ></v-text-field>
          <v-text-field
            v-model="newPassword"
            placeholder="Nuova password"
            :rules="[rules.required, rules.passwordFormat, sameAsOldPassword]"
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
        <v-btn @click="submit" outlined color="blue">Invia</v-btn>
      </v-card-actions>
    </v-card>
    <Snackbar :snackbarProps="snackbarProps" />
  </div>
</template>

<script>
import firebase from "firebase/app";
import { bus } from "@/main";
import { mapGetters } from "vuex";
import Snackbar from "../components/Snackbar";

export default {
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      re_newPassword: "",
      snackbarProps: {
        message:
          "La tua password è stata modificata con successo. Puoi tornare alla home",
        color: "success"
      }
    };
  },
  methods: {
    submit() {
      // Consento il submit solo se sono rispettate le regole di validazione del form
      if (this.$refs.form.validate()) {
        let user = firebase.auth().currentUser;
        let credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          this.currentPassword
        );
        user
          .reauthenticateWithCredential(credential)
          .then(() => {
            console.log("Password corrente verificata");
            // Se la password corrente è corretta, la aggiorno con quella nuova
            user
              .updatePassword(this.newPassword)
              .then(() => {
                console.log("Password modificata con successo");
                bus.$emit("snackbarMessage");
              })
              .catch(err => console.log(err.message));
          })
          .catch(err => console.log(err.message));
      }
    }
  },
  computed: {
    ...mapGetters({
      user: "authentication/user",
      rules: "validateFormRules/rules"
    }),
    sameAsOldPassword() {
      return (
        this.newPassword !== this.currentPassword ||
        "La nuova password deve essere diversa da quella precedente"
      );
    },
    passwordConfirmationRule() {
      return (
        this.newPassword === this.re_newPassword || "Le password non coincidono"
      );
    }
  },
  components: {
    Snackbar
  }
};
</script>