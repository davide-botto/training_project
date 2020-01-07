<template>
  <!-- <div class="login" ref="div"> -->
  <v-app id="inspire">
    <TopBar :properties="properties" />
    <v-content>
      <div align="center" v-show="infoLogout">Utente logged out</div>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" no-gutters>
          <v-col cols="12" sm="8" md="4">
            <v-row align="center" justify="center">
              <v-card class="elevation'12">
                <v-card-title>
                  <h2>Accedi</h2>
                  <div v-show="error" class="red--text">{{ error }}</div>
                  <v-card-text>
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
import { bus } from "@/main";

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
      error: ""
    };
  },
  methods: {
    login() {
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.replace({ name: "home" });
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    showLogout() {
      console.log("Evento session-ended");
      this.infoLogout = true;
    },

    getHeight() {
      return this.$refs.div.clientHeight;
    }
  },
  created() {
    bus.$on("session-ended", this.showLogout);
  },
  components: {
    TopBar,
    SignUp
  }
};
</script>