<template>
  <v-dialog v-model="dialog" @keydown.esc="cancel" persistent>
    <v-card>
      <v-card-title>Informazioni</v-card-title>
      <v-card-text>
          <v-simple-table>
              <tr>
                  <td>Nome:</td>
                  <td>{{payload.name}}</td>
                  
              </tr>
              <tr>
                  <td>Data:</td>
                  <td>{{payload.date}}</td>
              </tr>
          </v-simple-table>
      </v-card-text>
      <v-card-actions>
          <v-btn color="primary" text @click="dialog=false">Ok</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { bus } from "@/main";
export default {
  data() {
    return {
      dialog: false,
      payload: {}
    };
  },
  created() {
    bus.$on("openFileDialog", payload => {
    console.log("Evento openFileDialog")
      this.payload = payload;
      console.log(payload);
      this.dialog = true
    });
  }
};
</script>