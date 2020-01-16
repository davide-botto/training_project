<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title>{{dialogProps.title}}</v-card-title>
      <v-card-text>{{dialogProps.message}}</v-card-text>
      <v-card-actions>
        <v-btn @click="emailVerification">Resend verification email</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {auth} from "@/fb";
import {bus} from "@/main";

export default {
  props: {
    dialogProps: {
      type: Object
    }
  },

  data() {
    return {
      dialog: false
    };
  },
  created() {
      bus.$on("openResendPopup", () => {
          console.log("Evento open popup");
          this.dialog = true;
      })
  },

  methods: {
    emailVerification() {
      let user = auth.currentUser;
      user.sendEmailVerification().then(() => {
        console.log("Email verification");
        //bus.$emit("snackbarMessage");
        this.dialog = false;
      });
    }
  }
};
</script>