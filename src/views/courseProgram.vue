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
                <v-btn fab small outlined color="blue" v-on="on" @click="save(unit)">
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </template>
              <span>Salva</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{on}">
                <v-btn fab small outlined color="blue" v-on="on" @click="edit(index)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Modifica</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{on}">
                <v-btn fab small outlined color="blue" v-on="on" @click="deleteUnit(unit.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Elimina</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{on}">
                <v-btn
                  fab
                  small
                  outlined
                  color="blue"
                  v-if="index == units.length - 1"
                  @click="addUnit(index)"
                  v-on="on"
                >
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

export default {
  data() {
    return {
      unitTitle: "",
      description: "",
      editMode: false,
      units: [],
      editing: "",
      indexToAdd: 0,
      showTooltip: false
    };
  },
  created() {
    this.$store.dispatch("topbar/act_setBar", {
      title: { title1: "Programma del corso", title2: "Programma" },
      toHome: true,
      exit: true
    });

    db.collection("modules").onSnapshot(
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
            /*this.units.splice(this.units.indexOf(item, 0),0,{
              ...change.doc.data(),
              id: change.doc.id
            })*/
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
    );
  },

  methods: {
    addUnit(index) {
      db.collection("prova")
        .add({
          title: "Nuovo modulo",
          description: "Inserisci descrizione"
        })
        .then(() => {
          console.log("Editable module added to db");
                   
          this.editing = index + 1;
          this.editMode = true;
        })
        .catch(err => console.log(err.message));
    },
    deleteUnit(arg) {
      db.collection("modules")
        .doc(arg)
        .delete()
        .then(() => {
          console.log("Module deleted from db");
        })
        .catch(err => console.log(err.message));
    },
    save(unit) {
      if (this.editMode) {
        db.collection("modules")
          .doc(unit.id)
          .update({
            title: unit.title,
            description: unit.description
          })
          .then(() => {
            console.log("Module updated on db");
            this.editMode = false;
          })
          .catch(err => console.log(err.message));
      } else {
        console.log("No changes to save.");
      }
    },
    edit(index) {
      this.editing = index;
      this.editMode = true;
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