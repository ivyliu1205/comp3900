<template>
  <v-card outlined class="px-3">
    <v-card-title>
      <span class="text-h4">Search</span>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="8">
          <span class="text-h6">Cooking Time Limit</span>
        </v-col>
        <v-col>
          <span class="mx-4s">{{ !cookingTime ? "Infinite": `${cookingTime} min` }}</span>
          <CookingTimeEditDialog
            :open.sync="showCookingTimeDialog"
            :cookingTime="cookingTime"
            @save="updateCookingTime"
            @reset="resetCookingTime"
          />
          <v-btn icon @click="showCookingTimeDialog = true">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider />
      <span class="text-h6">Ingredients</span>
      <v-container fluid>
        <v-row>
          <LabelChip
            v-for="label of Object.values(selectedLabelMap)"
            :key="label.name"
            :disabled="loading"
            :enableMenu="false"
            color="indigo"
            :label="label"
            :selected="true"
            :closable="true"
            @unselect="unselectLabel(label.name)"
          ></LabelChip>
        </v-row>
        <v-row align="center" justify="space-around">
          <v-col cols="12" md="8" class="py-0">
            <v-text-field v-model="query" label="Search" clearable></v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="pt-0">
            <v-btn tile color="success" block @click="activateSearch()">
              <v-icon left>mdi-select-search</v-icon>Search
            </v-btn>
          </v-col>
        </v-row>

        <template v-if="!query || query.length === 0">
          <v-expansion-panels :disabled="loading">
            <v-expansion-panel
              v-for="category of Object.keys(filteredIngredientHierarchy)"
              :key="category"
              :disabled="filteredIngredientHierarchy[category].length === 0 || loading"
            >
              <v-expansion-panel-header>{{category}}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <LabelChip
                    v-for="label in filteredIngredientHierarchy[category]"
                    :key="label.name"
                    :disabled="loading"
                    :enableMenu="false"
                    color="indigo"
                    :label="label"
                    :selected="label.name in selectedLabelMap"
                    :closable="label.name in selectedLabelMap"
                    @select="selectIngredient(label.name)"
                    @unselect="unselectLabel(label.name)"
                  />
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>

        <template v-else>
          <template>
            <v-row>
              <LabelChip
                v-for="name of limitedSortedFilteredIngredientNames"
                :key="name"
                :disabled="loading"
                :enableMenu="false"
                color="indigo"
                :label="name"
                :selected="name in selectedLabelMap"
                :closable="name in selectedLabelMap"
                @select="selectIngredient(name)"
                @unselect="unselectLabel(name)"
              />
            </v-row>
            <v-row v-if="sortedFilteredIngredientNames.length - limitedSortedFilteredIngredientNames.length > 0">
              <span>There are {{sortedFilteredIngredientNames.length - limitedSortedFilteredIngredientNames.length }} matching ingredients hidden. Please be more specific with the search term.</span>
            </v-row>
          </template>
        </template>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import CookingTimeEditDialog from "@/components/CookingTimeEditDialog";
import LabelChip from "@/components/LabelChip";
export default {
  components: {
    CookingTimeEditDialog,
    LabelChip,
  },
  data() {
    return {
      query: "",
      showCookingTimeDialog: false,
    };
  },
  watch: {
    query(val) {
      this.$store.commit("explore/setQuery", val);
    },
  },

  computed: {
    ...mapState({
      loading: (state) => state.global.loading,
      cookingTime: (state) => state.explore["cookingTime"],
    }),
    ...mapGetters({
      filteredIngredientHierarchy: "explore/filteredIngredientHierarchy",
      selectedLabelMap: "explore/selectedLabelMap",
      sortedFilteredIngredientNames: "explore/sortedFilteredIngredientNames",
    }),
    limitedSortedFilteredIngredientNames() {
      const names = this.sortedFilteredIngredientNames
      return names.splice(0,  Math.min(50,names.length));
    },
  },

  methods: {
    activateSearch() {
      this.$store.dispatch("explore/activateSearch");
      this.$emit("clickSearch");
    },
    ...mapActions({
      unselectLabel: "explore/unselectLabel",
    }),
    ...mapMutations({
      selectIngredient: "explore/addSelectedIngredient",
      updateCookingTime: "explore/setCookingTime",
      resetCookingTime: "explore/resetCookingTime",
      updateQuery: "explore/updateQuery",
      clearQuery: "explore/clearQuery",
    }),
  },
};
</script>