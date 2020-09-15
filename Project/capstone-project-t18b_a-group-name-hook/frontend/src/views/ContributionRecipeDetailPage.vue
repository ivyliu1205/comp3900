<template>
  <v-main>
    <v-card :loading="loading" class="mx-auto my-0 fill-height fill-width"  width="100%">
      <v-row justify="center">
        <!-- Place holder -->
        <!-- Key = Date.now() to force update every time focusedRecipe is updated -->
        <RecipeDetailsEditSection
          :key="Date.now()"
          v-if="!loading && recipe"
          :editingForce="recipe.id === null"
          :loading="loading"
          :name="recipe.name"
          :ingredientMap="ingredientMap"
          :utensilMap="utensilMap"
          :mealTypeMap="mealTypeMap"
          :cuisineMap="cuisineMap"
          :selectedIngredients="recipe && 'ingredients' in recipe ? recipe.ingredients: {}"
          :selectedMealTypes="recipe && 'mealTypes' in recipe ? recipe.mealTypes: []"
          :selectedCuisines="recipe && 'cuisines' in recipe ? recipe.cuisines: []"
          :selectedUtensils="recipe && 'utensils' in recipe ? recipe.utensils: []"
          :steps="recipe.steps"
          :cookingTime="recipe.time"
          :imgSrcs="recipe.imgSrcs"
          @confirm="confirmEdit"
          @reset="resetEdit"
          @cancel="cancelEdit"
          @delete="confirmDelete"
          @errorMsg="showErrMsg"
        />
      </v-row>

      <v-container v-if="!loading && !recipe" fill-height fluid>
        <v-row justify="center" align="center">
          <v-col cols="12">
            <v-row justify="center">Sorry. The recipe is not available.</v-row>
          </v-col>
          <v-col cols="12">
            <v-row justify="center">
              <v-btn color="info" @click="toContributionHomePage">Go back</v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-main>
</template>

<script>
import RecipeDetailsEditSection from "@/components/RecipeDetailsEditSection";
import { mapState, mapGetters } from "vuex";
export default {
  components: { RecipeDetailsEditSection },
  beforeMount() {
    const id = this.$route.params.recipe_id;
    this.$store.dispatch("contribution/fetchRecipeDetails", id);
  },

  computed: {
    recipe() {
      return this.$store.state.contribution.focusedRecipe;
    },
    ...mapState({
      loading: (state) => state.global.loading,
    }),
    ...mapGetters({
      ingredientMap: "ingredientMap",
      utensilMap: "utensilMap",
      mealTypeMap: "mealTypeMap",
      cuisineMap: "cuisineMap",
      selectedIngredients: "contribution/focusedRecipeIngredientIdQuantityMap",
    }),
  },
  methods: {
    confirmDelete() {
      this.$store.dispatch("contribution/deleteRecipe");
    },
    confirmEdit(details) {
      if (!details) return;
      this.$store.dispatch("contribution/syncRecipe", {...details, id: this.recipe.id});
    },
    resetEdit(val) {
      this.$store.commit("setMsg", {
        type: "info",
        content: val ? "Content has been reset" : "Nothing has been changed",
        timeout: 4000,
      });
    },
    cancelEdit(val) {
      this.$store.commit("setMsg", {
        type: "info",
        content: val ? "Update has been discarded" : "Nothing has been changed",
        timeout: 4000,
      });
    },
    showErrMsg(msg) {
      this.$store.commit("setMsg", {
        type: "warning",
        content: msg,
        timeout: 4000,
      });
    },
    toContributionHomePage() {
      this.$store.dispatch("route/toContribute");
    },
  },
};
</script>

<style>
</style>