<template>
  <div class="home">
    <TopBar />
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-row align="center">
              <v-col cols="5" md="2" align="center">
                <v-avatar size="90">
                  <img
                    src="https://greendestinations.org/wp-content/uploads/2019/05/avatar-exemple.jpg"
                    alt="Ising"
                  />
                </v-avatar>
              </v-col>
              <v-col cols="6" md="6">
                <v-row>
                  <v-col>
                    <h2>{{user.data.displayName}}</h2>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="hidden-sm-and-down">{{user.data.email}}</v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="hidden-md-and-up" align="center">{{user.data.email}}</v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TopBar from "../components/TopBar";
import { mapGetters } from "vuex";
//import { db } from "@/fb";

export default {
  data() {
    return {
      student: {}
    };
  },
  created() {
    this.$store.dispatch("topbar/act_setBar", {
      title: "Profilo studente",
      toHome: true,
      exit: true
    });
  },
  computed: {
    ...mapGetters({
      user: "authentication/user",
      barprop: "topbar/barprop"
    })
  },
  components: {
    TopBar
  }
};
</script>