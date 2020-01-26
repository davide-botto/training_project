<template>
<!-- ******** Componente loader: viene mostrato quando faccio il refresh ********* -->
  <v-app>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" no-gutters>
          <v-col>
            <v-row align="center" justify="center">
              <v-card>
                <v-card-title class="justify-center">
                  <h2>Sto caricando</h2>
                  <v-card-text class="text-center">
                    <v-progress-circular indeterminate color="primary" :size="100"></v-progress-circular>
                  </v-card-text>
                </v-card-title>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

export default {
  data() {
    return {};
  },
  
};
</script>