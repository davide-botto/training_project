<template>
  <!-- <div class="login" ref="div"> -->
  <v-app id="inspire">
    <TopBar :properties="properties" />
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" no-gutters>
          <v-col cols="12" sm="8" md="4">
            <v-row align="center" justify="center">
              <v-card class="elevation'12">
                <div align="center" z-index="2" v-show="user.message">Arrivederci, sei stato logged out</div>
                <v-card-title>
                  <h2>Accedi</h2>
                  <v-card-text>
                    <div v-show="error" class="red--text">{{ error }}</div>
                    <v-form ref="form">
                      <v-text-field v-model="email" placeholder="Email" prepend-icon="mdi-account"></v-text-field>
                      <v-text-field
                        v-model="password"
                        placeholder="Password"
                        prepend-icon="mdi-lock"
                        type="password"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn class="mr-4" color="blue" dark @click="login">LOGIN</v-btn>
                    <SignUp />
                  </v-card-actions>
                </v-card-title>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
  <!-- </div> -->
</template>

<script>
import { auth } from "@/fb";
import SignUp from "../components/SignUp";
import TopBar from "../components/TopBar";
import store from "../store/";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      properties: {
        courseTitle: true,
        coursePage: false,
        students: false,
        exit: false
      },
      infoLogout: false,
      email: "",
      password: "",
      error: null
    };
  },
  methods: {
    login() {
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          store.dispatch("triggerMessage", false);
          this.$router.replace({ name: "home" });
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  },
  computed: {
    ...mapGetters({
      // map `this.user` to `this.$store.getters.user`
      user: "user"
    })
  },
  components: {
    TopBar,
    SignUp
  }
};
</script>