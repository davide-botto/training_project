<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-if="student" v-slot:activator="{on}">
      <v-btn class="px-2 grey lighten-2" min-width="0" max-width="20px" max-height="20px" v-on="on">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <template v-else v-slot:activator="{on}">
      <v-btn class="success mr-2" v-on="on">Nuovo</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <h2>{{ student ? "Modifica studente" : "Nuovo studente" }}</h2>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field label="Cognome" v-model="Cognome" :rules="inputRules"></v-text-field>
          <v-text-field label="Nome" v-model="Nome" :rules="inputRules"></v-text-field>

          <v-btn v-if="student" class="success" @click="save">Salva modifiche</v-btn>
          <v-btn v-else class="success" @click="submit">Inserisci</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {db} from "@/fb";

let pattern = /^[a-z]+$/i;
export default {
  props: {
    student: {
      type: Object
    }
  },
  data() {
    return {
      dialog: false,
      id: this.student ? this.student.id : "",
      Cognome: this.student ? this.student.Cognome : "",
      Nome: this.student ? this.student.Nome : "",
      inputRules: [v => pattern.test(v) || "Inserimento non valido"]
    };
  },
  methods: {
    submit: function() {
      if (this.$refs.form.validate()) {
        const project = {
          Cognome: this.Cognome,
          Nome: this.Nome
        };

        db.collection("students")
          .add(project)
          .then(() => {
            console.log("Student added to db.");
            this.$refs.form.reset();
            this.dialog = false;
          });
      }
    },
    save: function() {
      if (this.$refs.form.validate()) {
        db.collection("students")
          .doc(this.id)
          .update({
            Cognome: this.Cognome,
            Nome: this.Nome
          })
          .then(() => {
            this.$refs.form.reset();
            this.dialog = false
          });
      }
    }
  }
};
</script>

