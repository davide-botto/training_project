<template>
<div>
  <v-app-bar color="indigo" dark>
    <v-toolbar-title v-if="properties.courseTitle" class="d-none d-sm-flex">Corso di programmazione web</v-toolbar-title>
    <v-toolbar-title v-if="properties.courseTitle" class="d-flex d-sm-none">Sviluppo web</v-toolbar-title>
    <v-toolbar-title v-if="properties.coursePage" class="pa-2">Pagina del corso</v-toolbar-title>
    <v-toolbar-title v-if="properties.students" class="d-none d-sm-flex">Studenti iscritti</v-toolbar-title>
    <v-btn v-if="properties.home" text route to="/home">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <Popup v-if="properties.students && user.loggedIn && user.data.admin" />
    
    <Account v-if="properties.exit" />
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
      user: "user"
    })
  },

  components: {
    Popup,
    Account
  }
};
</script>