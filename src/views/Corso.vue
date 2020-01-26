<template>
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
              <h2>{{studentsNumber}}</h2>
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

      <!-- Creo una card per ogni document della raccolta "modules" e visualizzo il programma -->
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
      // Nome della raccolta su Firestore
      courseCollection: "units",
      students: [],
      units: []
    };
  },
  created() {
    this.$store.dispatch("topbar/act_setBar", {
      title: { title1: "Pagina del corso", title2: "Corso" },
      toHome: true,
      exit: true
    });


    db.collection("students").onSnapshot(
      res => {
        const changes = res.docChanges();
        changes.forEach(change => {
          if (change.type === "added") {
            //Ricavo i dati dal document e inserisco l'oggetto nell'array "students"
            this.students.push({
              ...change.doc.data(),
              id: change.doc.id
            });
          }
        });
      },
      err => console.log(err.message)
    );

    // Carico le unità del corso da Firestore
    db.collection(this.courseCollection).onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        let item = this.units.find(el => el.id == change.doc.id);
        if (change.type == "added") {
          console.log(change.doc.data());
          this.units = change.doc.data().moduli;
        } else if (change.type == "removed") {
          this.units.splice(this.units.indexOf(item, 0), 1);
        }
        // AGGIUNGI IL CASO "MODIFIED"
      });
    }, err => console.log(err.message));
    /*db.collection(this.courseCollection).onSnapshot(
      res => {
        const changes = res.docChanges();
        changes.forEach(change => {
          if (change.type == "added") {
            this.units.push({
              ...change.doc.data(),
              id: change.doc.id
            });
          }
        });
      },
      err => console.log(err.message)
    );*/
  },

  components: {
    TopBar
  },
  computed: {
    ...mapGetters({
      user: "authentication/user",
      barprop: "topbar/barprop"
    }),
    studentsNumber() {
      return this.students.length;
    }
  }
};
</script>