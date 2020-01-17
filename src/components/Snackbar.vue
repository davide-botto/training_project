<template>
    <v-snackbar v-model="snackbar" :color="payload.color" top>
      {{payload.message}}
      <v-btn @click="snackbar = false" dark>Chiudi</v-btn>
    </v-snackbar>
</template>

<script>
import {bus} from "@/main";
export default {
    /*props: {
        snackbarProps: {
            type: Object
        }
    },*/

    data() {
        return {
            snackbar: false,
           payload: {}
        }
    },
    created() {
        bus.$on("snackbarResetPass", (payload) => {
            console.log("Evento snackbarResetPass")
            console.log(payload);
            this.payload = payload;
            this.snackbar = true});
        
        bus.$on("snackbarVerify", (payload) => {
            console.log("Evento snackbarVerify")
            this.payload = payload
            this.snackbar = true});

        bus.$on("snackbarUpdate", (payload) => {
            console.log("Evento snackbarUpdate")
            this.payload = payload
            this.snackbar = true})
    }
}
</script>