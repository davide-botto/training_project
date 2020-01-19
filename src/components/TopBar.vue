<template>
<div>
  <v-app-bar color="indigo" dark>
    <v-toolbar-title v-if="barprop.data.barTitle" class="d-none d-sm-flex">{{barprop.data.barTitle.title1}}</v-toolbar-title>
    <v-toolbar-title v-if="barprop.data.barTitle" class="d-flex d-sm-none">{{barprop.data.barTitle.title2}}</v-toolbar-title>
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