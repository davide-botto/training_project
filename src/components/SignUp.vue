<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:activator="{on}">
      <v-btn outlined color="blue" v-on="on">Registrati</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <h2>Nuovo utente</h2>
        <div v-show="error" class="red--text">{{ error }}</div>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="email" placeholder="Email"></v-text-field>
            <v-text-field v-model="password" placeholder="Scegli password" type="password"></v-text-field>
            <v-btn class="mr-4" color="blue" dark @click="submit">Invia</v-btn>
          </v-form>
        </v-card-text>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script>
//import {db} from "@/fb";
import {auth} from "@/fb";

export default {
  data() {
    return {
      dialog: false,
      email: "",
      password: "",
      error: ""
    };
  },
  methods: {
      submit() {
          auth.createUserWithEmailAndPassword(this.email, this.password)
          .then(() => {
              this.dialog = false,
              this.$refs.form.reset()
          }).catch((err) =>{
              this.error = err.message;
          });
      }
  }
};
</script>



