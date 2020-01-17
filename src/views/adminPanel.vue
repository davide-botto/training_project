<template>
  <!-- Vista Home del profilo admin -->
  <div class="home">
    <TopBar />
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card height="200">
            <v-row>
              <v-col class="ml-2">
                <h3>Account admin</h3>
              </v-col>
            </v-row>

            <v-row align="center">
              <v-col cols="5" md="3" align="center">
                <v-avatar size="90">
                  <img src="https://www.svgrepo.com/show/34094/teacher.svg" alt="Ising" />
                </v-avatar>
              </v-col>
              <v-col cols="6" md="6">
                <v-row>
                  <v-col>
                    <h2>{{user.data.displayName}}</h2>
                  </v-col>
                </v-row>
                <v-row class="hidden-sm-and-down">
                  <v-col>{{user.data.email}}</v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
          <v-row class="hidden-md-and-up">
            <v-col cols="12" align="center">{{user.data.email}}</v-col>
          </v-row>
        </v-col>
        <v-col cols="6" md="3">
          <v-btn block router to="/studenti" style="text-transform: none" height="200">
            <v-content>
              <v-row justify="center">
                <v-col align="center">
                  <h2 class="hidden-sm-and-down">Studenti iscritti</h2>
                  <h2 class="hidden-md-and-up">Iscritti</h2>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col align="center">
                  <v-icon size="50">mdi-account-group</v-icon>
                </v-col>
              </v-row>
            </v-content>
          </v-btn>
        </v-col>
        <v-col cols="6" md="3">
          <v-btn block style="text-transform: none" @click="inputDialog = true" height="200">
            <v-content>
              <v-row justify="center">
                <v-col align="center">
                  <h2>Nuovo admin</h2>
                </v-col>
              </v-row>

              <v-row justify="center">
                <v-col align="center">
                  <v-icon size="50">mdi-account-star</v-icon>
                </v-col>
              </v-row>
            </v-content>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialog di inserimento email utente da rendere admin -->

    <v-dialog v-model="inputDialog" max-width="400px">
      <v-card>
        <v-card-title>
          <h3>Rendi un utente amministratore</h3>
          <div v-show="error" class="red--text">{{ error }}</div>
          <v-card-text>
            <v-form ref="form">
              <v-text-field v-model="adminEmail" placeholder="Email utente"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn class="success" dark @click="newAdmin">Invia</v-btn>
          </v-card-actions>
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TopBar from "../components/TopBar";
import { mapGetters } from "vuex";
import { functions } from "@/fb";

export default {
  data() {
    return {
      inputDialog: false,
      adminEmail: "",
      error: null
    };
  },
  created() {
    this.$store.dispatch("topbar/act_setBar", {
      courseTitle: true,
      coursePage: false,
      students: false,
      profile: false,
      toHome: false,
      exit: true
    });
  },
  methods: {
    newAdmin() {
      // Chiamo la cloud function
      const addAdminRole = functions.httpsCallable("addAdminRole");
      addAdminRole({ email: this.adminEmail })
        .then(result => {
          console.log(result);
          this.inputDialog = false;
          this.$refs.form.reset();
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  },
  computed: {
    ...mapGetters({
      user: "authentication/user",
      barprop: "topbar/barprop"
    })
  },
  components: {
    TopBar
  }
};
</script>
