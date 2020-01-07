<template>
  <div class="text-center">
    <v-menu offset-y>
      <template v-slot:activator="{on}">
        <v-btn outlined fab small color="white" v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click.stop="showDialog = true">Account</v-list-item>
        <v-list-item @click="logout">Esci</v-list-item>
      </v-list>
    </v-menu>
    <v-dialog v-model="showDialog">
      <v-card v-if="user.loggedIn">
        <v-card-title>
          <h3>Informazioni account</h3>
          <v-card-text>Utente logged in come {{user.data.email}}</v-card-text>
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { auth } from "@/fb";
import { mapGetters } from "vuex";
import {bus} from '@/main';

export default {
  data() {
    return {
        showDialog: false
    };
  },
  methods: {
    logout() {
      auth.signOut().then(() => {
        bus.$emit("session-ended");
        this.$router.replace({ name: "login" });
        
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
