<template>
  <v-dialog v-model="dialog" :max-width="options.width" @keydown.esc="cancel">
    <!-- Il dialog di conferma viene aperto all'evento "openPopup" emesso dal bus -->

    <v-card>
      <v-toolbar dark :color="options.color" dense flat>
        <v-toolbar-title>{{payload.title}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-4">
        {{dialogMessage}}
        <div v-show="error" class="red--text">{{error}}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click="removeStudent(payload.student.id)">Ok</v-btn>
        <v-btn color="grey" text @click="cancel">Annulla</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from "@/fb";
import { bus } from "@/main";
export default {
  props: {
    student: {
      type: Object
    },
  },
  data() {
    return {
      dialog: false,
      error: null,
      payload: {},       
      options: {
        color: "primary",
        width: 290,
        zIndex: 200
      }
    };
  },
  created() {
    bus.$on("openDialogConfirm", payload => {
      console.log("Evento open popup");
      this.payload = payload;
      this.dialog = true;
    });
  },
  methods: {
    cancel() {
      this.dialog = false;
    },
    removeStudent: function(arg) {
      db.collection("students")
        .doc(arg)
        .delete()
        .then(() => {
          console.log("Student deleted from db", arg);
          // Dopo la cancellazione setto la proprietà "isEnrolled a false"
          this.$store.dispatch("authentication/act_SET_ENROLLED", false);
          this.dialog = false;
        })
        .catch(() => (this.error = "Cancellazione non riuscita"));
    }
  },
  computed: {
    dialogMessage() {
      let string;
      
      if (this.student.name) {
        string =
          this.payload.message +
          " " +
          this.student.surname +
          " " +
          this.student.name;
      } else {
        string = this.payload.message;
      }

      return string + "?";
    }
  }
};
</script>