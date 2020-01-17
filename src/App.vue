<template>
  <v-app>
    <v-content>

    <div v-show="!isAuthenticatedAndverified">
      <Loading />
    </div> 
    <div v-show="isAuthenticatedAndverified">
      <router-view></router-view>
    </div>
    
      
    </v-content>
    <Snackbar />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import {bus} from "@/main";
import Loading from "@/components/Loading.vue"
import Snackbar from "@/components/Snackbar";

export default {
  name: "App",

  components: {
    Loading,
    Snackbar
  },

  data: () => ({
    isAuthenticatedAndverified: null
  }),
  
  computed: {
    ...mapGetters({
      user: "authentication/user"
    })
  },
  mounted() {
    console.log("App mounted");
    // Carico la loading page finché lo store non si aggiorna
    bus.$on("authStateChange", () =>  { this.isAuthenticatedAndverified = true });
  },
};
</script>
