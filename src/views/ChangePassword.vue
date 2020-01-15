<template>
  <div>
    <v-app-bar>
      <h2 class="blue--text">Cambio password</h2>
    </v-app-bar>
    <v-card>
      <v-card-text>
        <v-form id="changePasswordForm">
          <v-text-field v-model="currentPassword" placeholder="Vecchia password" type="password"></v-text-field>
          <v-text-field placeholder="Nuova password"></v-text-field>
          <v-text-field placeholder="Ripeti nuova password"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="submit">Invia</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import auth from "@/main";
export default {
  data() {
    return {
      currentPassword: "",
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
      }
    };
  },
  methods: {
    submit() {
      //let user = auth.currentUser;
      console.log(auth.EmailAuthProvider_Instance)
  }
  }
};
</script>