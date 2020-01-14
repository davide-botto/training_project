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
      students: []
    };
  },
  created() {
    this.$store.dispatch("topbar/act_setBar", {
        courseTitle: false,
        coursePage: true,
        students: false,
        profile: false,
        toHome: true,
        exit: true
      })

    db.collection("students").onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(
        change => {
          if (change.type === "added") {
            //Ricavo i dati dal document e inserisco l'oggetto nell'array "students"
            this.students.push({
              ...change.doc.data(),
              id: change.doc.id
            });
          }
        },
        err => console.log(err.message)
      );
    });
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