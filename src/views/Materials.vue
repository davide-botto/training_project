<template>
  <div>
    <TopBar />
    <v-file-input accept=".txt" label="Sfoglia..." v-model="file"></v-file-input>
    <v-btn @click="upload">Carica</v-btn>
    <v-simple-table>
      <template v-slot:default>
          <thead>
              <tr>
                  <th>File</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="item in items" :key="item.name">
                  <td><a :href="item.link">{{item.name}}</a></td>
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
      items: []
    };
  },
  created() {
    this.$store.dispatch("topbar/act_setBar", {
      title: { title1: "Materiali", title2: "Materiali" },
      toHome: true,
      exit: true
    });
  },
  methods: {
    // Upload del file selezionato su storage
    upload() {
      if (this.file) {
        // Se il file esiste, creo un riferimento
        let timestamp = Number(new Date());
        let storageRef = storage.ref(timestamp.toString());
        //let fileRef = storageRef.child(this.file.name);

        // Carico il file
        let uploadTask = storageRef.put(this.file);

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
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadURL) => {
                console.log("File available at", downloadURL);
                this.items.push[{name: this.file.name, link: downloadURL}]
              });
          }
        );
      } else {
        alert("Non hai selezionato un file da caricare.");
      }
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