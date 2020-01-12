<template>
  <div class="home">
    <TopBar />

    <v-container>
      <v-row justify="center" no-gutters>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>Informazioni</v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="6" md="4">
          <v-card>
            <v-card-text>Studenti iscritti</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="4">
          <v-card>
            <v-card-text>Numero</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import TopBar from "../components/TopBar";
import { mapGetters } from "vuex";
import store from "@/store/";

export default {
  data() {
    return {};
  },
  created() {
    store.dispatch("topbar/toggleTitle", false);
    store.dispatch("topbar/togglePage", true);
    store.dispatch("topbar/toggleStudents", false);
    store.dispatch("topbar/toggleHome", true);
    store.dispatch("topbar/toggleExit", true);
  },

  components: {
    TopBar
  },
  computed: {
    ...mapGetters({
      user: "authentication/user",
      barprop: "topbar/barprop"
    })
  }
};
</script>