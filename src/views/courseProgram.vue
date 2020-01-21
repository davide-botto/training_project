<template>
  <div>
    <TopBar />
    <v-row justify="center">
      <v-col cols="12">
        <v-card v-for="(unit, index) in units" :key="unit.id">
          <v-card-title>
            <v-text-field v-if="editMode && index == editing" v-model="unit.title"></v-text-field>
            <span v-else>{{unit.title}}</span>
          </v-card-title>
          <v-card-text>
            <v-textarea
              v-if="editMode && index == editing"
              name="moduleDescription"
              v-model="unit.description"
            ></v-textarea>
            <span v-else>{{unit.description}}</span>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <v-btn fab small outlined color="blue" v-on="on" @click="save()">
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </template>
              <span>Salva</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{on}">
                <v-btn fab small outlined color="blue" v-on="on" @click="edit(unit,index)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Modifica</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{on}">
                <v-btn fab small outlined color="blue" v-on="on" @click="deleteUnit(unit,index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Elimina</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{on}">
                <v-btn fab small outlined color="blue" @click="addUnit(index)" v-on="on">
                  <v-icon>mdi-card-plus</v-icon>
                </v-btn>
              </template>
              <span>Nuovo modulo</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopBar from "../components/TopBar";
import { db } from "@/fb";
import firebase from "firebase/app";
export default {
  data() {
    return {
      // Nome della raccolta su Firestore
      collection: "units",
      unitTitle: "",
      description: "",
      editMode: false,
      addMode: false,
      units: [],
      editing: "",
      documentId: "",
      showTooltip: false
    };
  },
  created() {
    this.$store.dispatch("topbar/act_setBar", {
      title: { title1: "Programma del corso", title2: "Programma" },
      toHome: true,
      exit: true
    });

    // Cerco le modifiche di tipo "added" per caricare sull'array "units" il documento appena creato
    db.collection(this.collection).onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type == "added") {
          console.log(change.doc.data());
          this.units = change.doc.data().moduli;
        }
      });
    });

    /** Alla creazione del componente controllo se esiste un documento:
     * se esiste leggo il suo Id e carico i dati nell'array units
     * se non esiste creo un documento
     */

    db.collection(this.collection)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          // Creo un documento
          console.log("Create a document");

          db.collection(this.collection)
            .add({
              moduli: [
                { title: "Nuovo modulo", description: "Inserisci descrizione" }
              ]
            })
            .then(docRef => {
              this.documentId = docRef.id;
              //this.units.push({ title: "Nuovo modulo", description: "Inserisci descrizione" })
            });
        } else {
          // Se esiste già un document, leggo il suo id
          console.log("There exists at least one document");
          this.documentId = querySnapshot.docs[0].id;

          // Carico i dati del documento nell'array "units"
          this.units = querySnapshot.docs[0].data().moduli;
        }
      });
    /*db.collection("modules").onSnapshot(
      res => {
        const changes = res.docChanges();
        changes.forEach(change => {
          if (change.type == "added") {
            console.log(this.editing);
            if (this.indexToAdd == 0) {
              this.units.push({
                ...change.doc.data(),
                id: change.doc.id
              });
            } else {
              console.log("Prova: " + this.indexToAdd);
            }
            
          } else if (change.type == "removed") {
            let item = this.units.find(el => el.id == change.doc.id);
            this.units.splice(this.units.indexOf(item, 0), 1);
          } else if (change.type == "modified") {
            let item = this.units.find(el => el.id == change.doc.id);
            this.units.splice(this.units.indexOf(item, 0), 1, {
              ...change.doc.data(),
              id: change.doc.id
            });
          }
        });
      },
      err => console.log(err.message)
    );*/
  },

  methods: {
    // Aggiungo un nuovo modulo nell'array "units"
    addUnit(index) {
      this.units.splice(index + 1, 0, {
        title: "Nuova prova",
        description: "Imparando"
      });
      this.editMode = true;
      this.addMode = true;
      this.editing = index + 1;
    },
    deleteUnit(unit, index) {
      let docRef = db.collection(this.collection).doc(this.documentId);

      docRef.update({
        moduli: firebase.firestore.FieldValue.arrayRemove(unit)
      });
      this.units.splice(index, 1);
    },
    /**  Salvo le modifiche o le aggiunte su database
     * NB gestisco edit e add a livello di array, 
     * poi sovrascrivo l'array su Firestore
    */
    save() {
     
      let docRef = db.collection(this.collection).doc(this.documentId);
      
      if (this.editMode) {
        docRef.set({moduli: this.units})
        .then(() => {
          console.log("Array updated on db");
          this.editMode = false;    
        })
        .catch(err => console.log(err.message));
          
      
      } else {
        console.log("No changes to save.");
      }
    },

    edit(unit,index) {
      // Attivo la "editMode" solo sulla card selezionata
      this.editing = index;
      this.editMode = true;
      // Modifico l'array "units"
      this.units.splice(index,1,unit);
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