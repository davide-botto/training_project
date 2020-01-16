<template>
    <v-snackbar v-model="snackbar" :color="snackbarProps.color" top>
      {{snackbarProps.message}}
      <v-btn @click.prevent="snackbar = false" dark>Chiudi</v-btn>
    </v-snackbar>
</template>

<script>
import {bus} from "@/main";
export default {
    props: {
        snackbarProps: {
            type: Object
        }
    },

    data() {
        return {
            snackbar: false
        }
    },
    created() {
        bus.$on("snackbarMessage", () => {
            console.log("Evento snackbarMessage")
            this.snackbar = true})
    }
}
</script>