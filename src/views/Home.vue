<template>
  <div class="home">
    <TopBar :properties="properties" />
    <v-bottom-navigation horizontal>
      <v-btn router to="/corso">
        <span>Pagina del corso</span>
      </v-btn>
      <v-btn router to="/studenti">
        <span>Studenti iscritti</span>
      </v-btn>
    </v-bottom-navigation>
    <!-- <div v-show="user" class="success--text" align="center">Utente connesso alla sessione</div> -->
    <v-container>
      <v-row align="center" no-gutters>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>Informazioni</v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
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
export default {
  data() {
    return {
      properties: {
        courseTitle: true,
        coursePage: false,
        students: false,
        home: false,
        exit: true
      }
    };
  },
  components: {
    TopBar
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  }
};
</script>