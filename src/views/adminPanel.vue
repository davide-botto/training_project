<template>
  <!-- Vista Home del profilo admin -->
  <div class="home">
    <TopBar />
    <v-container>
      <!-- <v-content> -->
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-card class="mx-auto" height="200">
            <v-row class="ml-1" align="start">
              <v-col style="font-variant: small-caps" cols="9" md="10">Account admin</v-col>
              
              <v-col cols="3" md="2">
                <v-btn fab small outlined color="blue" @click="triggerStepper">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col align="center" cols="5" sm="4">
                <v-avatar size="85">
                  <img :src="urlProfileImage" alt="Profilo" />
                </v-avatar>
              </v-col>
              <v-col>
                <v-row>
                  <h2>{{user.data.displayName}}</h2>
                </v-row>
                <v-row class="hidden-sm-and-down">{{user.data.email}}</v-row>
              </v-col>
            </v-row>
            <v-row justify="center" class="hidden-md-and-up">{{user.data.email}}</v-row>
          </v-card>
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
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-btn block style="text-transform: none" to="/courseProgram" height="100">
            <h3>Programma del corso</h3>
          </v-btn>
        </v-col>
        <v-col cols="6" md="3">
          <v-btn block style="text-transform: none" to="/materials" height="100">
            <h3>Materiali</h3>
          </v-btn>
        </v-col>
      </v-row>

      <!-- ****** Componente dialog con stepper per la modifica del profilo ********* -->
      <updateProfile :urlProfileImage="urlProfileImage"/>
    </v-container>

    <!-- Dialog di inserimento email utente da rendere admin -->

    <v-dialog v-model="inputDialog">
      <v-card>
        <v-card-title>
          <h3 class="hidden-sm-and-down">Rendi un utente amministratore</h3>
          <h3 class="hidden-md-and-up">
            Rendi un utente
            <br />amministratore
          </h3>
          <div v-show="error" class="red--text">{{ error }}</div>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                v-model="adminEmail"
                placeholder="Email utente"
                :rules="[rules.emailFormat]"
              ></v-text-field>
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
import updateProfile from "../components/updateProfile";
import { mapGetters } from "vuex";
import { bus } from "@/main";
import { functions, auth } from "@/fb";

export default {
  data() {
    return {
      inputDialog: false,
      adminEmail: "",
      urlProfileImage: null,
      error: null
    };
  },
  created() {
    this.$store.dispatch("topbar/act_setBar", {
      title: { title1: "Corso di programmazione web", title2: "Sviluppo web" },
      toHome: false,
      exit: true
    });

    // ********* Al caricamento della pagina, inizializzo l'immagine avatar *********** //
    if (auth.currentUser != null) {
      auth.currentUser.providerData.forEach( profile => {
        this.urlProfileImage = profile.photoURL
      })
    }
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
    },
    triggerStepper() {
      console.log("Evento open stepper");
      bus.$emit("openUpdateProfile");
    }
  },
  computed: {
    ...mapGetters({
      user: "authentication/user",
      barprop: "topbar/barprop",
      rules: "validateFormRules/rules"
    })
  },
  components: {
    TopBar,
    updateProfile
  }
};
</script>
