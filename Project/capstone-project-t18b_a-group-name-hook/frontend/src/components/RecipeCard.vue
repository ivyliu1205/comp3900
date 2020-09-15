ubl<template>
  <v-card width="400" @click="click()">
    <ImageCarousel
      :width="null"
      :height="200"
      :imgs="imgSrcs"
      :cycle="true"
      :showArrows="false"
      :hideDelimiters="true"
    />
    <v-card-title class="py-0">
      <v-row justify="space-between" class="fill-width">
        <v-col cols="7" class="py-0">
          <v-row justify="start">
            {{name}}
            <template v-if="showPublic">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon :color="isPublic ? 'primary': 'gray'" v-bind="attrs" v-on="on">
                    <v-icon>{{isPublic ? "mdi-earth": "mdi-earth-off"}}</v-icon>
                  </v-btn>
                </template>
                <span>{{isPublic ? "public": "hidden"}}</span>
              </v-tooltip>
            </template>

            <template v-if="showMissingIngredients">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    :color="!hasMissingIngredients ? 'success': 'gray'"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>{{!hasMissingIngredients ? "mdi-checkbox-marked-outline": "mdi-minus-box-outline"}}</v-icon>
                  </v-btn>
                </template>
                <span>{{hasMissingIngredients ? "There is missing ingredient": "You have all the ingredients"}}</span>
              </v-tooltip>
            </template>
          </v-row>
        </v-col>
        <v-col align-self="end" sm="auto" class="py-0">
          <span class="mdi mdi-av-timer">{{cookingTime !== null ? cookingTime + " min": "Not set"}}</span>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text class="text-primary pb-4">
      <span>{{"Ingredients: "}}</span>
      <template v-if="showMissingIngredients">
        <span
          v-for="name in matchingIngredientNames"
          :key="name"
          class="green--text"
        >{{name + ", "}}</span>
        <span v-for="name in missingIngredientNames" :key="name" class="red--text">{{name + ", "}}</span>
      </template>
      <template v-else>{{ingredientNames.join(",")}}</template>
      <span v-if="ingredientNames.length <= 0">Emtpy</span>
    </v-card-text>
  </v-card>
</template>

<script>
import ImageCarousel from "./ImageCarousel";
export default {
  components: { ImageCarousel },
  props: {
    name: String,
    isPublic: {
      type: Boolean,
      default: true,
    },
    showPublic: {
      type: Boolean,
      default: false,
    },
    showMissingIngredients: {
      type: Boolean,
      default: false,
    },
    ingredientNameInPossession: {
      type: Array,
      default: () => {
        return [];
      },
    },
    imgSrcs: {
      type: Array,
      default: () => [],
    },
    ingredientNames: {
      type: Array,
      default: () => {
        return [];
      },
    },
    cookingTime: {
      type: Number,
      default: 2,
    },
  },

  data() {
    return {
      missingIngredientMenuOpen: false,
    };
  },

  computed: {
    hasMissingIngredients() {
      return this.missingIngredientNames.length > 0;
    },
    matchingIngredientNames() {
      const res = [];
      for (const ing of this.ingredientNames) {
        if (this.ingredientNameInPossession.includes(ing)) {
          res.push(ing);
        }
      }
      return res;
    },
    missingIngredientNames() {
      const res = [];
      for (const ing of this.ingredientNames) {
        if (!this.ingredientNameInPossession.includes(ing)) {
          res.push(ing);
        }
      }
      return res;
    },
  },
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped>
</style>