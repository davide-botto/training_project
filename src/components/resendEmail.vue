<template>
<!-- Dialog per il reinvio del link di verifica email -->
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title>{{payload.title}}</v-card-title>
      <v-card-text>{{payload.message}}</v-card-text>
      <v-card-actions>
        <v-btn @click="emailVerification" outlined color="blue">Invia nuovo link</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { auth } from "@/fb";
import { bus } from "@/main";

export default {
  data() {
    return {
      dialog: false,
      payload: {}
    };
  },
  created() {
    bus.$on("openResendEmail", (payload) => {
      console.log("Evento open dialog reinvio email di verifica");
      this.payload = payload;
      this.dialog = true;
    });
  },

  methods: {
    emailVerification() {
      let user = auth.currentUser;
      user.sendEmailVerification().then(() => {
        console.log("Email verification");
        bus.$emit("snackbarVerify", {
          message:
            "Controlla la tua email. Abbiamo inviato un link di verifica all'indirizzo specificato",
          color: ""
        });
        this.dialog = false;
      });
    }
  }
};
</script>