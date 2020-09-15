<template>
  <v-container class="mx-0 pa-0">
    <v-col align="center">
      <v-card :elevation="0" :max-width="800">
        <v-col align="start">
          <!-- Image -->
          <v-row justify="center">
            <ImageCarousel :imgs="imgSrcs" :cycle="true" />
          </v-row>

          <!-- Title -->
          <v-row justify="space-between" align="center">
            <v-col justify="start" cols="12" md="9">
              <div class="text-h2 text-left">{{name}}</div>
            </v-col>
            <v-col justify="end" cols="12" md="3">
              <div class="text-h5 text-left">Ready in: {{cookingTime}} min</div>
            </v-col>
          </v-row>

          <!-- Labels -->
          <v-row justify="start" align="center" no-gutters class="ma-0 pa-0">
            <v-col align="left">
              <v-chip
                class="ma-1"
                color="indigo"
                text-color="white"
                v-for="name in mealTypes"
                :key="name"
              >{{name}}</v-chip>
              <v-chip
                class="ma-1"
                color="purple"
                text-color="white"
                v-for="name in cuisines"
                :key="name"
              >{{name}}</v-chip>
            </v-col>
          </v-row>
          <div class="hd"></div>

          <v-row>
            <!-- Ingreidents -->
            <v-col class="mx-2" cols="12" md="6">
              <v-row align="start">
                <div class="text-h4">Ingredients</div>
                <v-spacer />
              </v-row>
              <template v-if="ingredients.length > 0">
                <v-data-table
                  :headers="ingredientHeaders"
                  :items="ingredients"
                  item-key="name"
                  sort-by="name"
                  class="elevation-1"
                  hide-default-footer
                >
                  <!-- Edit quantity -->
                  <template v-slot:item.quantityUnit="{ item }">
                    <v-row align="center" justify="center">{{item.quantity}} {{item.unit}}</v-row>
                  </template>
                </v-data-table>
              </template>
              <template v-else>
                <v-container width="100%" height="100%">
                  <v-row align="center" justify="center">
                    <div>Not specified</div>
                  </v-row>
                </v-container>
              </template>
            </v-col>

            <div
              v-if="$vuetify.breakpoint.md || $vuetify.breakpoint.lg || $vuetify.breakpoint.xl"
              class="vd"
            ></div>

            <v-col v-else cols="12">
              <div class="hd"></div>
            </v-col>

            <!-- Utensils -->
            <v-col class="mx-2" md="5">
              <v-row align="start">
                <span class="text-h4">Utensils</span>
              </v-row>

              <v-data-table
                v-if="utensils.length !== 0"
                :headers="utensilHeaders"
                :items="utensilItems"
                item-key="name"
                sort-by="name"
                class="elevation-1"
                hide-default-footer
              ></v-data-table>

              <template v-else>
                <v-container width="100%" height="100%">
                  <v-row align="center" justify="center">
                    <div>Not specified</div>
                  </v-row>
                </v-container>
              </template>
            </v-col>
          </v-row>

          <div class="hd"></div>

          <!-- Steps -->
          <v-container fluid>
            <v-row align="start">
              <div class="text-h4">Steps</div>
            </v-row>
            <v-row align="start" justify="start" v-for="[i, s] of steps.entries()" :key="i">
              <span class="px-4 py-2 text-left">{{i+1}}. {{s}}</span>
            </v-row>
          </v-container>
        </v-col>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
import ImageCarousel from "./ImageCarousel";
export default {
  components: { ImageCarousel },
  props: {
    name: {
      type: String,
      default: "RECIPE NAME",
    },
    imgSrcs: {
      type: Array,
      default: () => [],
    },
    cookingTime: {
      type: Number,
      default: 60,
    },
    ingredients: {
      type: Array,
      default: () => [
        {
          name: "ingredient1",
          quantity: null,
          unit: "pieces",
        },
        {
          name: "ingredient2",
          quantity: 500,
          unit: "gram",
        },
      ],
    },
    mealTypes: {
      type: Array,
      default: () => ["gluten free", "sugerr free"],
    },
    cuisines: {
      type: Array,
      default: () => ["Chinese"],
    },
    utensils: {
      type: Array,
      default: () => ["Spoon"],
    },
    steps: {
      type: Array,
      default: () => [
        "Step 1........ ............. ............ .................. ................. ............... ...........................",
        "Step 2....",
        "Step 3....",
      ],
    },
    initUseMetric: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      ingredientHeaders: [
        {
          text: "Name",
          align: "center",
          value: "name",
        },
        { text: "Quantity", value: "quantityUnit", align: "center" },
      ],
      utensilHeaders: [
        {
          text: "Name",
          align: "center",
          value: "name",
        },
      ],
    };
  },

  computed: {
    utensilItems() {
      return this.utensils.map((name) => ({ name: name }));
    },
  },
};
</script>


