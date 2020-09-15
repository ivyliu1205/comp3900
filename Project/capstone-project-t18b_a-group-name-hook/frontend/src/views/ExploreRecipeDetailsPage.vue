<template>
  <v-main>
    <v-card :loading="loading" class="mx-auto my-0 fill-height fill-width">
      <RecipeDetailsSection
        v-if="!loading && recipe"
        :name="recipe.name"
        :imgSrcs="recipe.imgSrcs ? recipe.imgSrcs: []"
        :cookingTime="recipe.time"
        :ingredients="recipe.ingredients"
        :mealTypes="recipe.mealTypes"
        :cuisines="recipe.cuisines"
        :utensils="recipe.utensils"
        :steps="recipe.steps"
      />
      <v-container v-if="!loading && !recipe" fill-height fluid>
        <v-row justify="center" align="center">
          <v-col cols="12">
            <v-row justify="center">Sorry. The recipe is not available.</v-row>
          </v-col>
          <v-col cols="12">
            <v-row justify="center">
              <v-btn color="info" @click="toHomePage">Explore other recipes</v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-main>
</template>

<script>
import RecipeDetailsSection from "@/components/RecipeDetailsSection";
import { mapState } from "vuex";
export default {
  components: { RecipeDetailsSection },
  beforeMount() {
    this.$store.dispatch(
      "explore/fetchRecipeDetails",
      this.$route.params.recipe_id
    );
  },
  computed: {
    ...mapState({
      loading: (state) => state.global.loading,
    }),
    recipe() {
      const res = this.$store.getters["explore/matchedRecipeMap"][
        this.$route.params.recipe_id
      ];
      return res;
    },
  },
  methods: {
    toHomePage() {
      this.$store.dispatch("route/toExplore");
    },
  },
};
</script>

<style>
</style>