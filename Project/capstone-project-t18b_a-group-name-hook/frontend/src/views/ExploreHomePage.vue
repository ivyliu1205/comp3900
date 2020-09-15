<template>
  <v-main>
    <v-card :loading="loading" class="mx-auto my-0 pa-0 fill-height fill-width">
      <template v-if="shouldDisplayRecipes">
        <v-col class="pa-0" align-self="start">
          <!-- Selected labels -->
          <v-row align="start" justify="start" class="ma-0 pa-0">
            <v-col class="px-0 py-0 ma-0" cols="12">
              <v-card outlined class="fill-width fill-height ma-0 px-4">
                <v-row align="center" justify="start" class="px-4 flex">
                  <v-col class="mx-auto my-0 pa-0">
                    <v-row align="center">
                      <span class="text-h6 my-2">Your filters:</span>
                      <template v-if="cookingTime !== null">
                        <CookingTimeEditDialog
                          :open.sync="showCookingTimeDialog"
                          :cookingTime="cookingTime"
                          @save="updateCookingTime"
                          @reset="resetCookingTime"
                        />
                        <LabelChip
                          key="cookingTime"
                          :enableMenu="false"
                          color="orange"
                          :label="{name:`${cookingTime} min`}"
                          :selected="true"
                          :closable="true"
                          @select="startEditCookingTime"
                          @unselect="resetCookingTime"
                        />
                      </template>
                      <LabelChip
                        v-for="label of Object.values(selectedLabelMap)"
                        :key="label.name"
                        :enableMenu="false"
                        color="indigo"
                        :label="label"
                        :selected="true"
                        :closable="true"
                        @unselect="removeIngredient(label.name)"
                      />
                      <v-btn
                        v-if="cookingTime !== null || Object.keys(selectedLabelMap).length > 0"
                        color="gray"
                        icon
                        @click="clearSelection"
                        class
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                      <span v-else class="px-4">Empty</span>
                    </v-row>
                  </v-col>
                  <v-col v-if="!$vuetify.breakpoint.mobile" class="mx-auto my-0 pa-0">
                    <v-row justify="end">
                      <v-btn
                        color="info"
                        tile
                        witth="200"
                        @click="showSheet = true"
                        class="mx-4 my-2"
                      >
                        <v-icon>mdi-filter</v-icon>Advanced
                      </v-btn>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <!-- Suggested ingredients label -->
          <v-row align="start" justify="start">
            <v-col class="pa-0" cols="12">
              <v-card outlined class="fill-width ma-0 px-4">
                <v-row class="px-4" align="center">
                  <span class="text-h6">Suggestion:</span>
                  <LabelChip
                    v-for="ingredient in suggestedIngredients"
                    :key="ingredient.name"
                    :label="ingredient"
                    :enableMenu="false"
                    @select="addIngredient"
                  />
                  <span v-if="suggestedIngredients.length <= 0" class="px-4">Empty</span>
                  <v-spacer />
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <!-- Matched recipes -->
          <v-row align="start" justify="start">
            <v-col class="px-0 py-0" cols="12">
              <v-card outlined class="fill-width fill-height ma-0 px-8">
                <v-row align="start" justify="start">
                  <span class="text-h4">Matched Recipes:</span>
                </v-row>

                <v-row align="center" justify="center" class="fill-height fill-width my-4" no-gutters>
                  <RecipeCard
                  class="ma-2"
                    v-for="recipe in matchedRecipes"
                    :key="recipe.id"
                    :name="recipe.name"
                    :imgSrcs="recipe.imgSrcs || []"
                    :ingredientNames="recipe.ingredients.map(ingredient => ingredient.name)"
                    :ingredientNameInPossession="selectedIngredientNames"
                    :showMissingIngredients="true"
                    @click="accessRecipeDetails(recipe.id)"
                  />
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <div class="text-center">
          <v-bottom-sheet v-model="showSheet" fullscreen scrollable>
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <v-btn icon color="grey" right @click="showSheet = false" class="ma-5">
                  <v-icon x-large>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <SearchSection @clickSearch="search()" />
              </v-card-text>
            </v-card>
          </v-bottom-sheet>
        </div>
      </template>

      <template v-else>
        <v-row align="start" justify="center" no-gutters rows="12">
          <v-col cols="10">
            <SearchSection @clickSearch="search()" />
          </v-col>
        </v-row>
      </template>
      <v-tooltip v-if="shouldDisplayRecipes && $vuetify.breakpoint.mobile" left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            color="primary"
            fab
            bottom
            right
            fixed
            @click="showSheet = true"
          >
            <v-icon>mdi-filter</v-icon>
          </v-btn>
        </template>
        <span>Advanced selection</span>
      </v-tooltip>
    </v-card>
  </v-main>
</template>

<script>
import LabelChip from "@/components/LabelChip";
import RecipeCard from "@/components/RecipeCard";
import SearchSection from "@/components/SearchSection";
import CookingTimeEditDialog from "@/components/CookingTimeEditDialog";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  components: {
    SearchSection,
    RecipeCard,
    LabelChip,
    CookingTimeEditDialog,
  },
  data() {
    return {
      showCookingTimeDialog: false,
      showSheet: false,
      showAdvancedFilterTooltip: false,
    };
  },
  computed: {
    ...mapState({
      loading: (state) => state.global.loading,
      cookingTime: (state) => state.explore.cookingTime,
      shouldDisplayRecipes: (state) => state.explore["shouldDisplayRecipes"],
      matchedRecipes: state => state.explore.matchedRecipes,
    }),
    ...mapGetters({
      labelMap: "labelMap",
      selectedLabelMap: "explore/selectedLabelMap",
      suggestedIngredients:  "explore/filteredSuggestedIngredients",
      selectedIngredientNames: "explore/selectedIngredientNames"
    }),
  },
  methods: {
    search() {
      this.showSheet = false;
    },
    ...mapActions({
      accessRecipeDetails: "explore/accessRecipeDetails",
      removeIngredient: "explore/removeIngredientAndSearch",
      clearSelection: "explore/clearSelection",
    }),

    addIngredient(val) {
      this.$store.dispatch("explore/addIngredientAndSearch", val);
    },

    async updateCookingTime(val) {
      await this.$store.dispatch("explore/updateCookingTimeAndSearch", val);
    },

    async resetCookingTime() {
      await this.$store.dispatch("explore/resetCookingTimeAndSearch");
    },

    startEditCookingTime() {
      this.showCookingTimeDialog = true;
    },
  },
};
</script>
