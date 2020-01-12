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
    <div class="success--text" align="center">{{user}}</div>

    <!-- Form di iscrizione -->
    <v-row justify="center">
      <v-col cols="12">
      <div>Iscriviti</div>
      <v-form>
        <v-text-field label="Nome" v-model="student.name"></v-text-field>
        <v-text-field label="Cognome" v-model="student.surname"></v-text-field>
        <v-menu v-model="dateMenu" min-width="290px">
          <template v-slot:activator="{on}">
            <v-text-field label="Data di nascita" v-model="student.date" prepend-icon="mdi-calendar" v-on="on"></v-text-field>        
          </template>
          <v-date-picker v-model="student.date" @input="dateMenu=false"></v-date-picker>
        </v-menu>
      </v-form>
      </v-col>
    </v-row>
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
      },
      student: {
        name: "",
        surname: "",
        date: new Date().toISOString().substr(0, 10)
      },
      dateMenu: false
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