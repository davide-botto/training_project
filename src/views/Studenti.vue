<template>
  <div class="studenti">
    <TopBar :properties="properties"/>
    <v-container>
      <v-row class="pa-2">
       <v-col align="center">
          <v-card @click="sortBy('Cognome')">Cognome</v-card>
        </v-col>
        <v-col align="center">
          <v-card>Nome</v-card>
        </v-col>
      </v-row>
      <v-card v-for="student in students" :key="student.id">
        <v-row>
          <v-col align="center">
            {{student.Cognome}}
            <v-menu v-model="showMenu"></v-menu>
          </v-col>

          <v-col align="center">{{student.Nome}}</v-col>
          
        </v-row>
        <!-- Mostro i buttons di modifica e cancellazione solo se l'utente è admin -->
        <div v-show="user.loggedIn && user.isAdmin" id="handle-student">
          <Popup :student="student"/>
          <v-btn class="px-2 grey lighten-2" min-width="0" max-width="20px" max-height="20px" @click="removeStudent(student.id)">
            x
          </v-btn>
        </div>
        <v-divider></v-divider>
      </v-card>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Popup from "../components/Popup";
import TopBar from "../components/TopBar"
import { mapGetters } from "vuex";
import {db} from "@/fb";

export default {
  name: "home",
  data() {
    return {
      properties: {
        courseTitle: false,
        coursePage: false,
        students: true,
        home: true,
        exit: true
      },
      students: [],
      showMenu: false
    };
  },
  methods: {
    sortBy: function(prop) {
      if (prop === "Cognome") {
        this.students.sort((a, b) => (a[prop] < b[prop] ? -1 : 1));
      }
    },
    removeStudent: function(arg) {
      db.collection("students")
        .doc(arg)
        .delete()
        .then(() => {
          console.log("Student deleted from db");
          console.log(arg);
        });
    },
    show: function(event) {
      event.preventDefault;
      this.showMenu = true;
    }
  },
  computed: {
    ...mapGetters({
      // map `this.user` to `this.$store.getters.user`
      user: "authentication/user"
    })
  },

  created() {
    db.collection("students").onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          this.students.push({
            ...change.doc.data(),
            id: change.doc.id
          });
        } else if (change.type == "removed") {
          this.students = this.students.filter(item => item.id != change.doc.id);
        } else if (change.type == "modified") {
          let item = this.students.find(el => el.id == change.doc.id);
          this.students.splice(this.students.indexOf(item,0),1,{...change.doc.data(), id: change.doc.id})
        }
      });
    }, (err) => console.log(err.message));
  },

  components: {
    Popup,
    TopBar
  }
};
</script>
<style scoped>
  #handle-student {
    position: absolute;
    top: 2px;
    right:4px;
   
  }
</style>