<template>
  <v-main>
    <v-card :loading="loading" class="mx-auto my-0" height="100%" width="100%">
      <v-card-title>
        <v-row justify="space-between">
          <span class="headline mx-4">Your recipes</span>
          <span v-if="!$vuetify.breakpoint.mobile && hasRecipes">
            <v-btn class="mx-4" color="primary" @click="createRecipe">
              <v-icon>mdi-plus</v-icon>Create recipe</v-btn>
          </span>
        </v-row>
      </v-card-title>
      <template v-if="!loading">
        <v-container v-if="recipes === null" fill-height fluid>
          <v-row align="center" justify="center">
            <v-col align-self="center" justify-self="center" cols="12">
              <v-row align="center" justify="center">
                <span class="text-h5 text-center">Fail to access the server</span>
              </v-row>
              <v-row align="center" justify="center">
                <v-btn color="info" @click="$forceUpdate()">Click here to reload</v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-container>

        <v-container v-if="!hasRecipes" fill-height fluid>
          <v-row align="center" justify="center">
            <v-col align-self="center" justify-self="center" cols="12">
              <v-row align="center" justify="center">
                <span class="text-h5 text-center">There is no recipe</span>
              </v-row>
              <v-row align="center" justify="center">
                <v-btn color="info" @click="createRecipe">Create recipe</v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-container>

        <v-container v-else fill-width>
          <v-row align="start" justify="start">
            <v-col cols="12" sm="6" lg="4" xl="3" v-for="recipe of recipes" :key="recipe.id">
              <RecipeCard
                class="ma-3"
                :name="recipe.name"
                :showPublic="true"
                :isPublic="recipe.public"
                :imgSrcs="recipe.imgSrcs"
                :ingredientNames="recipe.ingredients.map(item => item.name)"
                @click="recipeClicked(recipe.id)"
              />
            </v-col>
          </v-row>
        </v-container>
        <v-tooltip v-if="$vuetify.breakpoint.mobile" left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              fab
              bottom
              right
              fixed
              @click="createRecipe"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Create recipe</span>
        </v-tooltip>
      </template>
    </v-card>
  </v-main>
</template>

<script>
import RecipeCard from "@/components/RecipeCard";
import { mapGetters, mapState } from "vuex";
export default {
  components: { RecipeCard },
  mounted() {
    this.$store.dispatch("contribution/getRecipes");
  },
  computed: {
    ...mapState({
      loading: state => state.global.loading,
    }),
    ...mapGetters({
      hasRecipes: "contribution/hasRecipes",
      recipes: "contribution/recipes"
    }),
   
  },
  methods: {
    recipeClicked(id) {
      this.$store.dispatch("contribution/accessRecipe", id);
    },
    createRecipe() {
      this.$store.dispatch("contribution/createRecipe");
    },
  },
};
</script>

<style>
</style>