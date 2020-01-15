<template>
  <v-dialog v-model="dialog" :max-width="options.width" @keydown.esc="cancel">
    <template v-slot:activator="{on}">
      <v-btn
        class="px-2 grey lighten-2"
        min-width="0"
        max-width="20px"
        max-height="20px"
        v-on="on"
      >x</v-btn>
    </template>
    <v-card>
      <v-toolbar dark :color="options.color" dense flat>
        <v-toolbar-title>{{dialogContent.title}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-4">{{dialogMessage}}
        <div v-show="error" class="red--text">{{error}}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click="removeStudent(student.id)">Ok</v-btn>
        <v-btn color="grey" text @click="cancel">Annulla</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from "@/fb";
export default {
  props: {
    student: {
      type: Object
    },
    dialogContent: {
      type: Object
    }
  },

  data() {
    return {
      dialog: false,
      error: null,
      title: "Cancellazione studente",
      message: "Confermi di voler cancellare lo studente",
      resolve: null,
      reject: null,
      options: {
        color: "primary",
        width: 290,
        zIndex: 200
      }
    };
  },
  methods: {
    cancel() {
      this.resolve(false);
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
          this.dialog=false;
          this.resolve(true);
        }).catch(() => this.error = "Cancellazione non riuscita");
    },
  },
  computed: {
    dialogMessage() {
      return (
        this.dialogContent.message +
        " " +
        this.student.surname +
        " " +
        this.student.name +
        "?"
      );
    }
  }
};
</script>