<template>
  <!-- ******** Pagina del corso studente ******** -->
  <div class="home">
    <TopBar />

    <v-container>
      <v-row justify="center" no-gutters>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>Informazioni</v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="6" md="4">
          <v-card>
            <v-card-text class="text-center">
              <h3>Studenti iscritti</h3>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="4">
          <v-card>
            <v-card-text class="text-center">
              <h2>{{enrolledStudents}}</h2>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <h2>Programma</h2>
              <v-spacer></v-spacer>
              <router-link v-show="user.isEnrolled" to="/materials">materiale</router-link>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>

      <!-- ****** Creo una card per ogni document della raccolta "modules" e visualizzo il programma ******* -->
      <v-card v-for="unit in units" :key="unit.id">
        <v-card-title>{{unit.title}}</v-card-title>

        <v-card-text>{{unit.description}}</v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import TopBar from "../components/TopBar";
import { mapGetters } from "vuex";
import { db } from "@/fb";

export default {
  data() {
    return {
      // ******* Nome della raccolta su Firestore ******* //
      courseCollection: "units",
      enrolledStudents: 0,
      units: []
    };
  },
  created() {
    this.$store.dispatch("topbar/act_setBar", {
      title: { title1: "Pagina del corso", title2: "Corso" },
      toHome: true,
      exit: true
    });

    /**--------------------------------------------------/
    ******* Conto il numero di studenti iscritti *******
    NB: questo metodo va bene per pochi documenti (meno di 100)
    ----------------------------------------------------*/
    db.collection("students").onSnapshot(res => {
      this.enrolledStudents = res.size;
    });

    // ********* Unità del corso: listener delle modifiche su Firestore (aggiunta, modifica, cancellazione) ********** //
    db.collection(this.courseCollection).onSnapshot(
      res => {
        const changes = res.docChanges();
        changes.forEach(change => {
          // ********** Ho un solo documento contenente un array: ricarico l'array units a ogni modifica ********** //
          if (
            change.type == "added" ||
            change.type == "removed" ||
            change.type == "modified"
          ) {
            this.units = change.doc.data().moduli;
          }
        });
      },
      err => console.log(err.message)
    );
  },

  components: {
    TopBar
  },
  computed: {
    ...mapGetters({
      user: "authentication/user",
      barprop: "topbar/barprop"
    })
  }
};
</script>