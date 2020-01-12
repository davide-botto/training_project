<template>
  <div class="home">
    <TopBar :properties="properties" />
        
    <v-container>
      <v-row justify="center" no-gutters>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>Informazioni</v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center" >
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
        home: true,
        exit: true
      }
    };
  },
  components: {
    TopBar
  },
  computed: {
    ...mapGetters({
      user: "authentication/user"
    })
  }
};
</script>