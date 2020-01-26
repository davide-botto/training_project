<template>
  <v-app>
    <v-content>
      <div v-if="!isAuthenticatedAndverified">
        <Loading />
      </div>
      <div v-if="isAuthenticatedAndverified">
        <router-view></router-view>
      </div>
    </v-content>
    <Snackbar />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import { bus } from "@/main";
import Loading from "@/components/Loading.vue";
import Snackbar from "@/components/Snackbar";

export default {
  name: "App",

  components: {
    Loading,
    Snackbar
  },

  data: () => ({
    isAuthenticatedAndverified: null,
    currentView: null
  }),

  computed: {
    ...mapGetters({
      user: "authentication/user"
    })
  },

  mounted() {
    console.log("App mounted");
    // Carico la loading page finché lo store non si aggiorna
    bus.$on("authStateChange", () => {
      this.isAuthenticatedAndverified = true;
    });
    //console.log(this.$router.currentRoute)
  },
  updated() {
    if (this.$router.currentRoute.name !== "login") {
      localStorage.setItem("name", this.$router.currentRoute.name);
    }
    this.$store.dispatch(
      "authentication/act_SET_SESSION_ROUTE",
      this.$router.currentRoute.name
    );
  }
};
</script>
