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
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import {bus} from "@/main";
import Loading from "@/components/Loading.vue"

export default {
  name: "App",

  components: {
    Loading
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
