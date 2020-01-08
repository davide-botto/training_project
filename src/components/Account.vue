<template>
  <div class="text-center">
    <v-menu offset-y>
      <template v-slot:activator="{on}">
        <v-btn outlined fab small color="white" v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click.stop="outputDialog = true">Account</v-list-item>

        <!-- Rendo visibile questa voce solo se l'utente è admin -->
        <v-list-item v-if="user.loggedIn && user.data.admin" @click="inputDialog = true">Crea nuovo admin</v-list-item>

        <v-list-item @click="logout">Esci</v-list-item>
      </v-list>
    </v-menu>

    <!-- Dialog con informazioni account -->
    <v-dialog v-model="outputDialog" max-width="400px">
      <v-card v-if="user.loggedIn">
        <v-card-title>
          <h3>Informazioni account</h3>
          <v-card-text>Utente logged in come {{user.data.email}}
            <div v-show="user.data.admin" align="center">Admin</div>

          </v-card-text>

        </v-card-title>
      </v-card>
    </v-dialog>

    <!-- Dialog di inserimento email utente da rendere admin -->
    <v-dialog v-model="inputDialog" max-width="400px">
      <v-card v-if="user.loggedIn && user.data.admin">
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
import { auth } from "@/fb";
import { mapGetters } from "vuex";
import { bus } from "@/main";
import { functions } from "@/fb";

export default {
  data() {
    return {
      inputDialog: false,
      outputDialog: false,
      adminEmail: "",
      error: null
    };
  },
  methods: {
    logout() {
      auth.signOut().then(() => {
        bus.$emit("session-ended");
        this.$router.replace({ name: "login" });
      });
    },
    newAdmin() {
      // Chiamo la cloud function
      const addAdminRole = functions.httpsCallable("addAdminRole");
      addAdminRole({ email: this.adminEmail }).then(result => {
        console.log(result);
        this.inputDialog = false;
        this.$refs.form.reset();

      }).catch(err => {
        this.error = err.message;
      });
    }
  },
  computed: {
    ...mapGetters({
      // map `this.user` to `this.$store.getters.user`
      user: "user"
    })
  }
};
</script>
