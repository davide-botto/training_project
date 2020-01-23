<template>
  <div class="home">
    <TopBar />
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-row align="center">
              <v-col cols="5" md="2" align="center">
                <v-avatar v-if="editing">
                  <span class="grey--text" @dblclick="triggerDialog">Cambia</span>
                </v-avatar>
                <v-avatar v-else size="90">
                  <img
                    src="https://greendestinations.org/wp-content/uploads/2019/05/avatar-exemple.jpg"
                    alt="Ising"
                  />
                </v-avatar>
              </v-col>
              <v-col cols="6" md="6">
                <v-row>
                  <v-col>
                    <v-text-field v-if="editing" v-model="user.data.displayName"></v-text-field>
                    <h2 v-else>{{user.data.displayName}}</h2>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="hidden-sm-and-down">
                    <v-text-field v-if="editing" v-model="user.data.email"></v-text-field>
                    <span>{{user.data.email}}</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="hidden-md-and-up" align="center">{{user.data.email}}</v-col>
            </v-row>
            <v-card-actions>
              <v-btn fab small outlined color="blue" @click="editProfile">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn fab small outlined color="blue" @click="saveProfile">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <changeAvatar />
  </div>
</template>

<script>
import TopBar from "../components/TopBar";
import { mapGetters } from "vuex";
import { auth, db } from "@/fb";
import { bus } from "@/main";
import changeAvatar from "../components/changeAvatar"
export default {
  data() {
    return {
      student: {},
      editing: false,
      changingEmail: false
    };
  },
  created() {
    this.$store.dispatch("topbar/act_setBar", {
      title: { title1: "Profilo studente", title2: "Profilo" },
      toHome: true,
      exit: true
    });
  },
  methods: {
    triggerDialog() {
      bus.$emit("openSelectAvatar");
      console.log("Evento openDialog");
    },
    editProfile() {
      this.editing = true;
    },

    saveProfile() {
      auth.currentUser
        .updateProfile({
          displayName: this.user.data.displayName
        })
        .then(() => {
          console.log("Aggiornamento avvenuto con successo");
          let firstName = this.user.data.displayName.split(" ")[0];
          let lastName = this.user.data.displayName.split(" ")[1];

          // Se lo studente è iscritto al corso, aggiorno nome e cognome dello studente sul database degli studenti iscritti
          if (this.user.isEnrolled) {
            db.collection("students")
              .doc(auth.currentUser.uid)
              .update({
                name: firstName,
                surname: lastName
              })
              .then(() => {
                console.log("Student updated to db.");
              })
              .catch(err => console.log(err.message));
          }
        })

        .catch(err => console.log(err.message));

      this.editing = false;
    }
  },
  computed: {
    ...mapGetters({
      user: "authentication/user",
      barprop: "topbar/barprop"
    })
  },
  components: {
    TopBar,
    changeAvatar
  }
};
</script>