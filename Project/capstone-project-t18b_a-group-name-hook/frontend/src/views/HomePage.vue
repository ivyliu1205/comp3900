<template>
  <v-main>
    <v-container fluid class="background_pic fill-height px-0 mx-0">
      <v-row align="center" justify="center" no-gutters>
        <v-col cols="10">
          <v-card elevation="1" class="px-2">
            <v-card-title>
              <v-col>
                <div class="text-h2">Welcome to MealMatch <span class="text-h5">by The_Group_Name</span></div>
                <div
                  class="text-h5"
                >Find out what you can cook with only the ingredients you currently have</div>
              </v-col>
            </v-card-title>
            <v-card-text>
              <v-row align="center" justify="center" class="mt-4">
                <v-btn class="ma-2" color="success" @click="toExplore()">Explore recipes</v-btn>
                <v-btn class="ma-2" color="info" @click="toContribute()">Contribute your own recipe</v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  components: {},
  methods: {
    toExplore() {
      this.$store.dispatch("route/toExplore");
    },
    toContribute() {
      this.$store.dispatch("route/toContribute");
    },
  },
};
</script>

<style scoped>
.background_pic {
  background-image: url("~@/assets/background.jpg");
  background-size: cover;
}
</style>