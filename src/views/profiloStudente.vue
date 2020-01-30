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
                  <!-- <img
                    src="https://greendestinations.org/wp-content/uploads/2019/05/avatar-exemple.jpg"
                    alt="Ising"
                  />-->
                  <img :src="source" alt="Profilo" />
                </v-avatar>
              </v-col>
              <v-col cols="6" md="6">
                <v-row>
                  <v-col>
                    <!-- <v-text-field v-if="editing" v-model="user.data.displayName"></v-text-field> -->
                    <h2>{{user.data.displayName}}</h2>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="hidden-sm-and-down">
                    <!-- <v-text-field v-if="editing" v-model="user.data.email"></v-text-field> -->
                    <span>{{user.data.email}}</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="hidden-md-and-up" align="center">{{user.data.email}}</v-col>
            </v-row>
            <v-card-actions>
              <v-btn fab small outlined color="blue" @click="triggerStepper">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <!-- <v-btn @click="downloadImage">scarica</v-btn>
              <v-btn fab small outlined color="blue" @click="saveProfile">-->
              <!-- <v-icon>mdi-content-save</v-icon>
               </v-btn>
              <img :src="source" alt="Prova" />-->
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- ******* Componente dialog con stepper per la modifica del profilo ********* -->
    <updateProfile />
  </div>
</template>

<script>
import TopBar from "../components/TopBar";
import updateProfile from "../components/updateProfile";
import { mapGetters } from "vuex";
import { bus } from "@/main";
import { auth } from "@/fb";
import { downloadImage } from "@/download";

export default {
  data() {
    return {
      student: {},
      urlProfileImage: null,
      source: null
    };
  },

  created() {
    this.$store.dispatch("topbar/act_setBar", {
      title: { title1: "Profilo studente", title2: "Profilo" },
      toHome: true,
      exit: true
    });

    /********* Al caricamento della pagina, inizializzo l'immagine avatar ***********
     * Non voglio esporre l'url dell'immagine, per non renderlo condivisibile: scarico
     * il file binario e lo converto in stringa Base64
     *********************************************************************************/

    if (auth.currentUser != null) {
      auth.currentUser.providerData.forEach(profile => {
       
       /**-------------------------------------------------------------------------
        ****** Questa funzione viene passata come callback a "downloadImage" ******
        NB: il metodo è asincrono, non posso fare un semplice return
        ---------------------------------------------------------------------------*/
        const setSource = (payload) => {
          this.source = payload;
        }


        downloadImage(profile.photoURL, setSource);
        
      });
    }
  },

  methods: {
    //******** Invio la stringa base64 dell'immagine come payload sull'event bus ********/
    triggerStepper() {
      console.log("Evento open stepper");
      bus.$emit("openUpdateProfile", {base64String: this.source});
    }

        
  },
  computed: {
    ...mapGetters({
      user: "authentication/user",
      barprop: "topbar/barprop"
    }),
    imageProfile() {
      return this.urlProfileImage;
    }
  },
  components: {
    TopBar,
    updateProfile
  }
};
</script>