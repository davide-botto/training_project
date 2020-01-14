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
            </v-card-title>
            <v-card-text>
         
              <v-form ref="form">
                <v-text-field label="Nome" :value="firstName" readonly></v-text-field>
                <v-text-field label="Cognome" :value="lastName" readonly></v-text-field>
                <v-menu v-model="dateMenu" min-width="290px" :close-on-content-click="false">
                  <template v-slot:activator="{on}">
                    <!-- Mostro la data come stringa nel formato italiano, ma la salvo  come oggetto Date-->
                    <v-text-field
                      label="Data di nascita"
                      v-model="formattedDate"
                      @blur="date = parseDate(formattedDate)"
                      prepend-icon="mdi-calendar"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date" @input="dateMenu=false"></v-date-picker>
                </v-menu>
                
              </v-form>
              <v-card-actions>
                <v-btn @click="enrollStudent">Invia</v-btn>
              </v-card-actions>
            </v-card-text>
          
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import TopBar from "../components/TopBar";
import store from "@/store/";
import { mapGetters } from "vuex";
import { db } from "@/fb";
import { auth } from "@/fb";

let pattern = /^[a-zì'àè]+$/i;

export default {
  data: vm => ({
    date: new Date().toISOString().substr(0, 10),
    formattedDate: vm.formatDate(new Date().toISOString().substr(0, 10)),
    
    student: {
      name: "",
      surname: "",
      birthDate: ""
    },
    dateMenu: false,
    inputRules: [v => pattern.test(v) || "Inserimento non valido"]
  }),

  created() {
    store
      .dispatch("topbar/act_setBar", {
        courseTitle: true,
        coursePage: false,
        students: false,
        profile: false,
        toHome: false,
        exit: true
      })
      
  },
  components: {
    TopBar
  },
  computed: {
    ...mapGetters({
      user: "authentication/user",
      barprop: "topbar/barprop"
    }),
    firstName() {
      return this.user.data.displayName.split(' ')[0];
    },
    lastName() {
      return this.user.data.displayName.split(' ')[1];
    }
  },
  
  watch: {
     date() {
       this.formattedDate = this.formatDate(this.date)
     }
  },

  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    // Carica su Firebase i dati dal form di iscrizione
    enrollStudent() {
      if (this.$refs.form.validate()) {
        db.collection("students")
        .doc(auth.currentUser.uid)
          .set({
            birthDate: new Date(this.date)
          })
          .then(() => {
            console.log("Student added to db.");
            this.$refs.form.reset();
          });
      }
    }
  }
};
</script>