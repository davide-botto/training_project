<template>
  <div class="studenti">
    <TopBar />
    <v-container>
      <v-row class="pa-2">
        <v-col align="center">
          <v-card @click="sortBy('Cognome')">Cognome</v-card>
        </v-col>
        <v-col align="center">
          <v-card>Nome</v-card>
        </v-col>
        <v-col align="center">
          <v-card>Data di nascita</v-card>
        </v-col>
      </v-row>
      <v-card v-for="student in students" :key="student.id">
        <v-row>
          <v-col align="center">
            {{student.surname}}
            <v-menu v-model="showMenu"></v-menu>
          </v-col>

          <v-col align="center">{{student.name}}</v-col>
          <v-col align="center">{{student.birthDate}}</v-col>
        </v-row>
        <!-- Mostro i buttons di modifica e cancellazione solo se l'utente è admin -->
        <div v-show="user.loggedIn && user.isAdmin" id="handle-student">
         <DialogConfirm :student="student" :dialogContent="dialogContent"/>
        </div>
        <v-divider></v-divider>
      </v-card>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import TopBar from "../components/TopBar";
import DialogConfirm from "../components/DialogConfirm";
import { mapGetters } from "vuex";
import { db } from "@/fb";

export default {
  name: "home",
  data() {
    return {
      students: [],
      showMenu: false,
      dialogContent: {
        title: "Cancellazione studente",
        message: "Confermi di voler cancellare lo studente"
      }
    };
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    },
    sortBy: function(prop) {
      if (prop === "Cognome") {
        this.students.sort((a, b) => (a[prop] < b[prop] ? -1 : 1));
      }
    },
    
    show: function(event) {
      event.preventDefault;
      this.showMenu = true;
    }
  },

  computed: {
    ...mapGetters({
      // map `this.user` to `this.$store.getters.user`
      user: "authentication/user",
      barprop: "topbar/barprop"
    })
  },

  created() {
    db.collection("students").onSnapshot(
      res => {
        const changes = res.docChanges();
        changes.forEach(change => {
          if (change.type === "added") {
            console.log(
              new Date(change.doc.data().birthDate.seconds * 1000)
                .toISOString()
                .substr(0, 10)
            );

            this.students.push({
              name: change.doc.data().name,
              surname: change.doc.data().surname,
              birthDate: new Date(change.doc.data().birthDate.seconds * 1000)
                .toISOString()
                .substr(0, 10),
              id: change.doc.id
            });
          } else if (change.type == "removed") {
            this.students = this.students.filter(
              item => item.id != change.doc.id
            );
          } else if (change.type == "modified") {
            let item = this.students.find(el => el.id == change.doc.id);
            this.students.splice(this.students.indexOf(item, 0), 1, {
              ...change.doc.data(),
              id: change.doc.id
            });
          }
        });
      },
      err => console.log(err.message)
    );

    this.$store.dispatch("topbar/act_setBar", {
      courseTitle: false,
      coursePage: false,
      students: true,
      profile: false,
      toHome: true,
      exit: true
    });
  },

  components: {
    TopBar,
    DialogConfirm
  }
};
</script>
<style scoped>
#handle-student {
  position: absolute;
  top: 2px;
  right: 4px;
}
</style>