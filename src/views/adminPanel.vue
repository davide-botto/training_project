<template>
  <!-- Vista Home del profilo admin -->
  <div class="home">
    <TopBar />
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Account admin</v-card-title>
            <v-card-text>
              <div>{{user.data.displayName}}</div>
              <div>{{user.data.email}}</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-btn
            block
            router
            to="/studenti"
            style="text-transform: none"
           
          >
            Studenti iscritti
            <v-icon>mdi-account-group</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="6" md="3">
          <v-btn block style="text-transform: none"  @click="inputDialog = true">
            <span style="white-space: normal">
              Nuovo admin
              <v-icon>mdi-account-star</v-icon>
            </span>
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