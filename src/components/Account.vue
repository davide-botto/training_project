<template>
  <div class="text-center">
    <v-menu offset-y>
      <template v-slot:activator="{on}">
        <v-btn outlined fab small color="white" v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <!-- <v-list-item @click.stop="outputDialog=true">Account</v-list-item> -->
        <v-list-item v-if="user.signInMethod!=='account'" @click="toChangePassword">Cambio password</v-list-item>
        <v-list-item @click="logout">Esci</v-list-item>
      </v-list>
    </v-menu>

    </div>
</template>

<script>
import { auth } from "@/fb";
import { mapGetters } from "vuex";
import store from "../store/";

export default {
  data() {
    return {
      
    };
  },
  methods: {
    logout() {
      auth.signOut().then(() => {
        store.dispatch("authentication/act_resetUser");
        store.dispatch("authentication/act_triggerMessage", true);
        localStorage.clear();
        this.$router.replace({ name: "login" });
      });
    },
    toChangePassword() {
      this.$router.replace({name: "changePassword"});
    }
  },
  computed: {
    ...mapGetters({
      // map `this.user` to `this.$store.getters.user`
      user: "authentication/user"
    })
  }
};
</script>
