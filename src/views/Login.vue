<template>
  <!-- <div class="login" ref="div"> -->
  <v-app id="inspire">
    <TopBar />
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" no-gutters>
          <v-col>
            <v-row align="center" justify="center">
              <v-card class="elevation'12 v-flex">
                <div
                  align="center"
                  z-index="2"
                  v-if="user.message"
                >Arrivederci, sei stato logged out</div>
                <v-card-title>
                  <h2>Accedi</h2>
                </v-card-title>
                <v-card-text class="text-center">
                  <div v-show="error" class="red--text">{{ error }}</div>
                  <v-form ref="form" @submit.prevent="login" id="login-form">
                    <v-text-field
                      v-model="email"
                      placeholder="Email"
                      :rules="[rules.required, rules.emailFormat]"
                      prepend-icon="mdi-account"
                    ></v-text-field>
                    <v-text-field
                      v-model="password"
                      placeholder="Password"
                      :rules="[rules.required]"
                      prepend-icon="mdi-lock"
                      type="password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-container>
                    <v-row>
                      <v-col cols="6">
                        <v-btn block color="blue" dark form="login-form" type="submit">LOGIN</v-btn>
                      </v-col>
                      <v-col cols="6">
                        <SignUp />
                      </v-col>
                      <v-col cols="12">
                        <v-btn block @click="inputDialog = true">Hai dimenticato la password?</v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-dialog v-model="inputDialog" max-width="400px">
      <v-card class="d-flex justify center">
        <v-card-title>
          <h3>Reset password</h3>
          <div v-show="error" class="red--text">{{ error }}</div>
          <v-card-text>
            <p>Inserisci il tuo indirizzo email</p>
            <v-form ref="form">
              <v-text-field v-model="email" placeholder="Email"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn class="success" dark @click="resetPassword">Invia</v-btn>
          </v-card-actions>
        </v-card-title>
      </v-card>
    </v-dialog>
  </v-app>
  <!-- </div> -->
</template>

<script>
import { auth } from "@/fb";
import SignUp from "../components/SignUp";
import TopBar from "../components/TopBar";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
      inputDialog: false,
      rules: {
        emailFormat: v =>
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
            v
          ) || "Formato email non valido",
        required: value => !!value || "Campo necessario"
      }
    };
  },
  methods: {
    login() {
      this.$store.dispatch("authentication/triggerMessage", false);
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          if (user) {
            if (user.user.emailVerified) {
              console.log("Email verified");
              /*this.$store
                .dispatch("authentication/set_isVerified", user.user)
                .then(() => {
                  // Se l'email è verificata, controllo la presenza di custom claims
                  user.user.getIdTokenResult().then(IdTokenResult => {
                    let admin = IdTokenResult.claims.admin;
                    // Scrivo il claim admin su store
                    this.$store
                      .dispatch("authentication/set_admin", admin)
                      .then(() => {
                        console.log("Prova");
                        this.$router
                          .replace({ name: "home" }).catch(() => {console.log("Errore router")})
                        
                      }).catch((err) => console.log(err.message));
                  });
                })
                .catch(err => console.log(err.message));
            } */
            } else {
              this.error = "Email non verificata";
            }
          }
        })
        .catch(err => (this.error = err.message));
    },
    resetPassword() {
      auth.languageCode = "it";
      auth
        .sendPasswordResetEmail(this.email)
        .then(() => {
          alert(
            "Controlla la tua casella di posta. Abbiamo inviato un link di reset password all'indirizzo specificato"
          );
          this.inputDialog = false;
          this.$refs.form.reset();
        })
        .catch(err => (this.error = err.message));
    }
  },
  created() {
    this.$store.dispatch("topbar/act_setBar", {
        courseTitle: true,
        coursePage: false,
        students: false,
        profile: false,
        toHome: false,
        exit: false
      })
  },
  computed: {
    ...mapGetters({
      // map `this.user` to `this.$store.getters.user`
      user: "authentication/user",
      barprop: "topbar/barprop"
    })
  },
  components: {
    TopBar,
    SignUp
  }
};
</script>