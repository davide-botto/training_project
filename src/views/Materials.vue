<template>
  <div>
    <TopBar />
    <v-container v-if="user.isAdmin">
      <v-row>
        <v-col cols="12" md="6">
          <v-file-input label="Sfoglia..." outlined v-model="file"></v-file-input>
        </v-col>
        <v-col cols="4" md="4">
          <v-btn @click="upload" outlined color="blue">Carica</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>File</th>
            <th>Data upload</th>
          </tr>
        </thead>
        <tbody>
          
            <tr v-for="(item, index) in uploadedFiles" :key="item.name">
              
              <td>
                <a :href="item.link">{{item.name.split("-")[1]}}</a>
              </td>
              <td>
                {{item.uploadDate}}
                <span v-show="user.loggedIn && user.isAdmin">
                  <v-btn
                    class="px-1 grey lighten-2 hidden-sm-and-down"
                    min-width="0"
                    max-width="15px"
                    max-height="15px"
                    @click="removeFile(item.name, index)"
                  >x</v-btn>
                </span>
              </td>
             
            </tr>
          
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>
    

<script>
import { mapGetters } from "vuex";
import TopBar from "../components/TopBar";

import { storage } from "@/fb";
import { storageProp } from "@/fb";
export default {
  data() {
    return {
      file: null,
      downloadlink: null,
      uploadedFiles: []
    };
  },
  created() {
    this.$store.dispatch("topbar/act_setBar", {
      title: { title1: "Materiali", title2: "Materiali" },
      toHome: true,
      exit: true
    });
    // Controllo i file presenti su storage, carico nome e link nell'array "uploadedFiles"
    storage
      .ref()
      .child("materiale/")
      .listAll()
      .then(res => {
        res.prefixes.forEach(folderRef => console.log(folderRef));
        res.items.forEach(itemRef => {
          itemRef.getDownloadURL().then(urlRef => {
            // ******** Ricavo il nome del file e la data di upload dalla stringa ************ //
            let uploadDate = itemRef.name.split("-")[0];
            uploadDate = this.formatDate(
              new Date(+uploadDate).toISOString().substr(0, 10)
            );

            this.uploadedFiles.push({
              name: itemRef.name,
              link: urlRef,
              uploadDate: uploadDate
            });
          });
        });
      })
      .catch(err => console.log(err.message));
  },

  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    },

    // Upload del file selezionato su storage
    upload() {
      let dataUpload;
      if (this.file) {
        // Se il file esiste, creo un riferimento
        dataUpload = new Date();
        let timestamp = Number(dataUpload);
        let storageRef = storage.ref();

        let fileRef = storageRef.child(
          "materiale/" + timestamp.toString() + "-" + this.file.name
        );

        // Carico il file
        let uploadTask = fileRef.put(this.file);

        //Ascolto i cambi di stato, gli errori e il completamento dell'upload
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
          () => {
            // Se l'upload è completato correttamente, ottengo l'url per il download
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              console.log("File available at", downloadURL);

              dataUpload = dataUpload.toISOString().substr(0, 10);
              this.uploadedFiles.push({
                name: timestamp.toString() + "-" + this.file.name,
                link: downloadURL,
                uploadDate: this.formatDate(dataUpload)
              });
              this.file = null;
            });
          }
        );
      } else {
        alert("Non hai selezionato un file da caricare.");
      }
    },

    // *********** Chiamo il metodo "removeFile" su dispositivi mobili *********** //
    /** Se il breakpoint è sm o xs, chiamo il metodo removeFile */
    removeForMobile(filename, index) {
      if (this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm) {
        this.removeFile(filename, index);
      }
    },
    removeFile(filename, index) {
      console.log(filename);
      // ********* Creo un riferimento al file che voglio cancellare *********** //
      let deletingFileRef = storage.ref().child("materiale/" + filename);
      // ********* Cancello il file su storage *********** //
      deletingFileRef
        .delete()
        .then(() => {
          console.log("File deleted on storage");
          // ********** Cancello il riferimento sull'array "uploadedFiles" *********** //
          this.uploadedFiles.splice(index, 1);
        })
        .catch(err => console.log(err.message));
    }
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

<style scoped>
#remove-file {
  position: absolute;
  top: 4px;
  right: 2px;
}
</style>