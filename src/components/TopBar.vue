<template>
<div>
  <v-app-bar color="indigo" dark>
    <v-toolbar-title v-if="barprop.courseTitle" class="d-none d-sm-flex">Corso di programmazione web</v-toolbar-title>
    <v-toolbar-title v-if="barprop.courseTitle" class="d-flex d-sm-none">Sviluppo web</v-toolbar-title>
    <v-toolbar-title v-if="barprop.coursePage" class="pa-2">Pagina del corso</v-toolbar-title>
    <v-toolbar-title v-if="barprop.students" class="d-none d-sm-flex">Studenti iscritti</v-toolbar-title>
    <v-btn v-if="barprop.home" text route to="/home">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-spacer></v-spacer>

    <template v-if="barprop.students">
    <Popup v-if="user.loggedIn && user.isAdmin" />
    </template>
    
    <Account v-if="barprop.exit" />
  </v-app-bar>
  
</div>
</template>

<script>
import Popup from "../components/Popup";
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
    Popup,
    Account
  }
};
</script>