<template>
  <!-- ******** DIALOG CONTENENTE UNO STEPPER PER LA MODIFICA DEL PROFILO UTENTE ********** -->
  <v-dialog v-model="editProfile">
    <v-card>
      <v-card-title>Modifica profilo</v-card-title>
      <v-stepper v-model="progress">
        <!-- ********** PRIMO STEP: nome visualizzato *********** -->
        <v-stepper-step editable :comlete="progress >1" step="1">Modifica nome</v-stepper-step>
        <v-stepper-content step="1">
          <v-form>
            <v-text-field v-model="user.data.displayName"></v-text-field>
          </v-form>
          <v-btn color="primary darken-1" text @click="progress=2">Avanti</v-btn>
          <v-btn color="grey" text @click="editProfile=false">Annulla</v-btn>
        </v-stepper-content>

        <!-- ********** SECONDO STEP: immagine di profilo *********** -->
        <v-stepper-step :complete="progress>2" step="2">Immagine di profilo</v-stepper-step>
        <v-stepper-content step="2">
          <v-card>
            <v-row>
              <v-col cols="4" md="2" align="center">
                <v-avatar size="90">
                  <img :src="urlProfileImage" alt="Profilo" />
                </v-avatar>
              </v-col>
              <v-col cols="6" md="5">
                <v-file-input v-model="imageFile"></v-file-input>
              </v-col>
              <v-col cols="2" md="3">
                <v-btn outlined color="blue" @click="uploadImage">Carica</v-btn>
              </v-col>
            </v-row>
          </v-card>
          <v-btn color="primary darken-1" text @click="progress=3">Avanti</v-btn>
          <v-btn color="grey" text @click="progress=1">Indietro</v-btn>
        </v-stepper-content>

        <!-- ********** TERZO STEP: riepilogo dati *********** -->
        <v-stepper-step editable :comlete="progress > 3" step="3">Riepilogo</v-stepper-step>
        <v-stepper-content step="3">
          <v-row>
            <v-col cols="4" md="2" align="center">
              <v-avatar size="90">
                <img :src="urlProfileImage" alt="Profilo" />
              </v-avatar>
            </v-col>
            <v-col cols="6" md="5">
              <v-form>
                <v-text-field :value="user.data.displayName" readonly></v-text-field>
              </v-form>
            </v-col>
          </v-row>
          <v-btn color="primary darken-1" text @click="saveProfile">Salva modifiche</v-btn>
          <v-btn color="grey" text @click="progress=2">Indietro</v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script>
import { bus } from "@/main";
import { mapGetters } from "vuex";
import { auth, db, storage, storageProp } from "@/fb";

export default {
  props: ['urlProfileImage'],
  data() {
    return {
      editProfile: false,
      progress: 1,
      imageFile: null,
      
    };
  },
  created() {
    bus.$on("openUpdateProfile", () => {
      console.log("Evento open stepper ricevuto");
      this.editProfile = true;
    });

    // ********* Al caricamento della pagina, inizializzo l'immagine avatar *********** //
    if (auth.currentUser != null) {
      auth.currentUser.providerData.forEach(profile => {
        this.urlProfileImage = profile.photoURL;
      });
    }
  },
  methods: {
    //------------------------------------------------------------//
    /** Attivo la modifica del profilo utente:
     * compare uno stepper che gestisce i passaggi di modifica:
     * 1 - modifica nome
     * 2 - modifica immagine di profilo
     * 3 - modifica email dell'account
     */

//--------------------------------------------------------------------//
    // ************ Caricamento immagine di profilo **************** //
//-------------------------------------------------------------------//
    uploadImage() {
      // ******** Per prima cosa controllo se è stato caricato un file *********** //
      if (this.imageFile) {
        // ********* Un file valido deve avere una proprietà name ******** //
        if (this.imageFile.name) {
          let storageRef = storage
            .ref()
            .child(
              "profilePhotos/" +
                auth.currentUser.uid +
                "-" +
                this.imageFile.name
            );

          console.log(storageRef);
          // ********** Carico il file su storage ************** //
          let uploadTask = storageRef.put(this.imageFile);

          // *********** Ascolto i cambi di stato, gli errori e il completamento dell'upload ************ //
          uploadTask.on(
            "state_changed",
            function(snapshot) {
              // Get del progresso di caricamento
              let progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case storageProp.TaskState.PAUSED:
                  console.log("upload is paused");
                  break;
                case storageProp.TaskState.RUNNING:
                  console.log("Upload is running");
                  break;
              }
            },
            // ******** Gestione casi di errore ************ //
            function(error) {
              switch (error.code) {
                case "storage/unauthorized":
                  console.log(
                    "L'utente non ha il permesso di accedere all'oggetto"
                  );
                  break;
                case "storage/canceled":
                  console.log("L'upload è stato cancellato");
                  break;
                case "storage/unknown":
                  console.log(
                    "Errore non previsto, ispezionare errore error.serverResponse"
                  );
                  break;
              }
            },
            // ******** Caso di successo ********** //
            () => {
              // ********* Se l'upload è completato correttamente, ottengo l'url per il download ********** //
              uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                console.log("File available at", downloadURL);
                this.urlProfileImage = downloadURL;
                this.imageFile = null;
              });
            }
          );
        } else {
          alert("Il file inserito non è valido");
        }
      } else {
        alert("Non hai scelto nessun file");
      }
    },

    //-------------------------------------------------//
    // ********** Salvataggio modifiche ************** //
    //--------------------------------------------------//
    saveProfile() {
      auth.currentUser
        .updateProfile({
          displayName: this.user.data.displayName,
          photoURL: this.urlProfileImage
        })
        .then(() => {
          console.log("Aggiornamento avvenuto con successo");
          let firstName = this.user.data.displayName.split(" ")[0];
          let lastName = this.user.data.displayName.split(" ")[1];

          // ************* Se lo studente è iscritto al corso, aggiorno nome e cognome dello studente sul database degli studenti iscritti ****************//
          if (this.user.isEnrolled) {
            db.collection("students")
              .doc(auth.currentUser.uid)
              .update({
                name: firstName,
                surname: lastName
              })
              .then(() => {
                console.log("Student updated to db.");
                this.editProfile = false
              })
              .catch(err => console.log(err.message));
          } else {
            this.editProfile = false
          }
        })

        .catch(err => console.log(err.message));

      this.editing = false;
    }
  },
  computed: {
    ...mapGetters({
      user: "authentication/user"
    })
  }
};
</script>
