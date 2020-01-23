<template>
  <v-dialog v-model="dialog" max-width="300" max-height="50">
      <v-card>
          <v-card-title>Vuoi cambiare l'immagine di profilo?</v-card-title>
          <v-card-actions>
              <v-btn @click="dialog = false">Annulla</v-btn>
          </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<script>
import { bus } from "@/main";

export default {
  data() {
    return {
      dialog: false
    };
  },
  created() {
      bus.$on("openSelectAvatar", () => {
          console.log("Evento open dialog ricevuto")
          this.dialog = true
          })
      
  }
};
</script>
