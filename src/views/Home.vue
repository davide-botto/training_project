<template>
  <div class="home">
    <TopBar />
    <v-bottom-navigation horizontal>
      <v-btn router to="/corso">
        <span>Pagina del corso</span>
      </v-btn>
      <v-btn v-show="user.isAdmin" router to="/studenti">
        <span>Studenti iscritti</span>
      </v-btn>
      <v-btn v-show="!user.isAdmin" router to="/profiloStudente">
        <span>Profilo studente</span>
      </v-btn>
    </v-bottom-navigation>
    <div class="success--text" align="center">{{user}}</div>

    <!-- Form di iscrizione -->
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <v-toolbar color="blue lighten-1" dark flat>
              <h2>Iscriviti al corso</h2>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field label="Nome" v-model="student.name"></v-text-field>
                <v-text-field label="Cognome" v-model="student.surname"></v-text-field>
                <v-menu v-model="dateMenu" min-width="290px">
                  <template v-slot:activator="{on}">
                    <v-text-field
                      label="Data di nascita"
                      v-model="formatDate"
                      prepend-icon="mdi-calendar"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="student.date" @input="dateMenu=false"></v-date-picker>
                </v-menu>
              </v-form>
              <v-card-actions>
                <v-btn @click="enrollStudent">Invia</v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import TopBar from "../components/TopBar";
import store from "@/store/";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      student: {
        name: "",
        surname: "",
        date: new Date().toISOString().substr(0, 10)
      },
      dateMenu: false
    };
  },
  created() {
    store
      .dispatch("topbar/toggleTitle", true)
      .then(() => {
        store.dispatch("topbar/togglePage", false);
      })
      .then(() => {
        store.dispatch("topbar/toggleStudents", false);
      })
      .then(() => {
        store.dispatch("topbar/toggleHome", false);
      })
      .then(() => {
        store.dispatch("topbar/toggleExit", true);
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
    formatDate() {
      let arr = this.student.date.split("-");
      return arr[2] + "-" + arr[1] + "-" + arr[0];
    }
  },
  methods: {
    enrollStudent() {
      console.log(this.student);
    }
  }
};
</script>