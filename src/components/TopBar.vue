<template>
<div>
  <v-app-bar color="indigo" dark>
    <v-toolbar-title v-if="barprop.data.courseTitle" class="d-none d-sm-flex">Corso di programmazione web</v-toolbar-title>
    <v-toolbar-title v-if="barprop.data.courseTitle" class="d-flex d-sm-none">Sviluppo web</v-toolbar-title>
    <v-toolbar-title v-if="barprop.data.coursePage" class="pa-2">Pagina del corso</v-toolbar-title>
    <v-toolbar-title v-if="barprop.data.students" class="d-none d-sm-flex">Studenti iscritti</v-toolbar-title>
    <v-toolbar-title v-if="barprop.data.profile" class="d-none d-sm-flex">Profilo studente</v-toolbar-title>
    <v-btn v-if="barprop.data.toHome" text :to="(user.isAdmin) ? '/adminPanel' : '/home'">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-spacer></v-spacer>

        
    <Account v-if="barprop.data.exit" />
  </v-app-bar>
  
</div>
</template>

<script>

import Account from "../components/Account";
import { mapGetters } from "vuex";

export default {
  props: {
    properties: {
      type: Object
    }
  },

  data() {
    return {
      infoLogout: false
    };
  },
  computed: {
    ...mapGetters({
      // map `this.user` to `this.$store.getters.user`
      user: "authentication/user",
      barprop: "topbar/barprop"
    })
  },

  components: {
    Account
  }
};
</script>