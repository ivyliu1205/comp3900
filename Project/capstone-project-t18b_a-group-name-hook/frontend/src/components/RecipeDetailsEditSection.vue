<template>
  <v-card class="mx-0 pa-0" elevation="0" width="100%">
    <v-col>
      <v-card :elevation="0">
        <v-card-title>
          <span v-if="editing" class="headline">Edit recipe</span>
          <span v-else class="headline">{{nameBuf}}</span>
        </v-card-title>
        <v-card-text>
          <v-col>
            <!-- Image -->
            <ImageCarousel
              :editing="editing"
              :imgs="existingImgSrcsBuf.concat(newImgFiles)"
              @addImage="addImage"
              @removeImage="removeImage"
            />

            <v-form ref="editForm">
              <!-- Publicity -->
              <v-row align="center">
                <v-col cols="12" sm="4" class="text-h6">Make public?</v-col>
                <v-switch :disabled="!editing" v-model="publicBuf" />
              </v-row>

              <!-- Name -->
              <v-row v-if="editing" align="center">
                <v-col cols="12" sm="2" class="text-h6">Name:</v-col>
                <v-text-field v-model="nameBuf" :rules="nameRules" required></v-text-field>
              </v-row>
              <br />

              <!-- Cooking time -->
              <v-row align="center">
                <v-col cols="12" sm="4" class="text-h6">Cooking Time (min):</v-col>
                <span class="mx-4">{{ !cookingTimeBuf ? "(empty)": `${cookingTimeBuf} min` }}</span>
                <template v-if="editing">
                  <CookingTimeEditDialog
                    :open.sync="showCookingTimeDialog"
                    :cookingTime="cookingTimeBuf"
                    @save="updateCookingTime"
                    @reset="resetCookingTime"
                  />
                  <v-btn icon @click="showCookingTimeDialog=true">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-row>
              <br />

              <!-- Steps -->
              <v-row>
                <v-col cols="12" sm="3">
                  <div class="text-h6">Steps:</div>
                </v-col>
                <v-col>
                  <v-row align="center" v-for="[i,] of stepsBuf.entries()" :key="i">
                    {{i+1}}.
                    <v-text-field v-if="editing" class="ml-2" v-model="stepsBuf[i]">
                      <template v-slot:append-outer>
                        <v-btn icon @click="insertStep(i+1)">
                          <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                        <v-btn icon @click="removeStep(i)">
                          <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                    <span v-else>{{stepsBuf[i]}}</span>
                  </v-row>

                  <!-- New step -->
                  <v-row v-if="editing" align="center">
                    {{stepsBuf.length+1}}.
                    <v-text-field
                      v-model="newStepBuf"
                      class="ml-2 pt-2"
                      @change="addStep"
                      label="New step..."
                    ></v-text-field>
                  </v-row>
                </v-col>
              </v-row>

              <!-- Ingredients -->
              <v-row>
                <v-col cols="12" sm="3">
                  <div class="text-h6">Ingredients:</div>
                </v-col>
                <v-col>
                  <v-data-table
                    :headers="ingredientHeaders"
                    :items="selectedIngredientItems"
                    item-key="name"
                    sort-by="name"
                    class="elevation-1"
                    hide-default-footer
                  >
                    <!-- Edit quantity -->
                    <template v-slot:item.quantity="{ item }">
                      <v-edit-dialog v-if="editing" large :return-value.sync="item.quantity">
                        <template v-slot:input>
                          <v-text-field v-model="item.quantity" type="number" label="Piece"></v-text-field>
                        </template>
                        <v-row align="center" justify="center">
                          {{item.quantity? item.quantity: "(empty)"}}
                          <v-icon v-if="editing">mdi-pencil</v-icon>
                        </v-row>
                      </v-edit-dialog>

                      <v-row v-else align="center" justify="center">{{item.quantity}}</v-row>
                    </template>

                    <template v-slot:item.unit="{ item }">
                      <v-edit-dialog v-if="editing" large :return-value.sync="item.unit">
                        <template v-slot:input>
                          <v-text-field v-model="item.unit" label="Piece"></v-text-field>
                        </template>
                        <v-row align="center" justify="center">
                          {{item.unit ? item.unit: "(empty)"}}
                          <v-icon v-if="editing">mdi-pencil</v-icon>
                        </v-row>
                      </v-edit-dialog>

                      <v-row v-else align="center" justify="center">{{item.unit}}</v-row>
                    </template>

                    <!-- Actions -->
                    <template v-if="editing" v-slot:item.action="{ item }">
                      <v-btn icon @click="removeIngredient(item)">
                        <v-icon small>mdi-delete</v-icon>
                      </v-btn>
                    </template>

                    <!-- Add new ingredient -->
                    <template v-if="editing" v-slot:body.append="{headers}">
                      <v-menu
                        v-model="addIngredientMenuOpen"
                        bottom
                        :close-on-content-click="false"
                        rounded="lg"
                        origin="top center"
                        allow-overflow
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <tr class="ma-0 pa-0">
                            <td :colspan="headers.length" class="ma-0 pa-0">
                              <v-row justify="center" align="center" class="ma-0 pa-0 fill-width">
                                <v-col class="ma-0 pa-0">
                                  <v-btn
                                    v-bind="attrs"
                                    v-on="on"
                                    text
                                    block
                                    class="fill-width fill-height"
                                  >Add ingredients</v-btn>
                                </v-col>
                              </v-row>
                            </td>
                          </tr>
                        </template>
                        <SimpleSearchSection
                          :excludeSelected="true"
                          :searchItems="ingredientHierarchy"
                          :selectedKeys="selectedIngredientsBuf.map(x=>x.name)"
                          :maxAppearance="50"
                          @select="addIngredientWhenMenuOpen"
                        />
                      </v-menu>
                    </template>
                  </v-data-table>
                  <v-row
                    class="d-flex flex"
                    v-if="editing && (missingIngredientNotificationStr || excessiveIngredientNotificationStr)"
                  >
                    <v-col cols="auto">
                      <v-row>
                        <template>{{missingIngredientNotificationStr}}</template>
                      </v-row>
                      <v-row>
                        <template>{{excessiveIngredientNotificationStr}}</template>
                      </v-row>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn text color="info" @click="fixIngredientMatching">Fix it</v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <!-- Meal type -->
              <v-row>
                <v-col cols="12" sm="3">
                  <div class="text-h6">Meal types:</div>
                </v-col>
                <v-col cols="12" sm="9">
                  <span class="d-flex flex-wrap">
                    <LabelChip
                      v-for="item of selectedMealTypeItems"
                      :key="item"
                      :selected="true"
                      :closable="editing"
                      :label="item"
                      @unselect="removeMealType"
                    />
                  </span>
                  <!-- Add new meal type -->
                  <v-menu
                    v-if="editing"
                    v-model="addMealTypeMenuOpen"
                    bottom
                    :close-on-content-click="false"
                    rounded="lg"
                    origin="top center"
                    allow-overflow
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" text block>Add meal type</v-btn>
                    </template>
                    <SimpleSearchSection
                      :excludeSelected="true"
                      :searchItems="Object.values(mealTypeMap)"
                      :selectedKeys="selectedMealTypesBuf"
                      @select="addMealType"
                    />
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Cuisines -->
              <v-row>
                <v-col cols="12" sm="3">
                  <div class="text-h6">Cuisines:</div>
                </v-col>
                <v-col cols="12" sm="9">
                  <span class="d-flex flex-wrap">
                    <LabelChip
                      v-for="item of selectedCuisineItems"
                      :key="item"
                      :selected="true"
                      :closable="editing"
                      :label="item"
                      @unselect="removeCuisine"
                    />
                  </span>

                  <!-- Add new cuisine -->
                  <v-menu
                    v-if="editing"
                    v-model="addCuisineMenuOpen"
                    bottom
                    :close-on-content-click="false"
                    rounded="lg"
                    origin="top center"
                    allow-overflow
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" text block>Add cuisine</v-btn>
                    </template>
                    <SimpleSearchSection
                      :excludeSelected="true"
                      :searchItems="Object.values(cuisineMap)"
                      :selectedKeys="selectedCuisinesBuf"
                      @select="addCuisine"
                    />
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Utensils -->

              <v-row>
                <v-col cols="12" sm="3">
                  <div class="text-h6">Utensils:</div>
                </v-col>
                <v-col cols="12" sm="9">
                  <v-col>
                    <v-row align="center" v-for="[i,] of selectedUtensilsBuf.entries()" :key="i">
                      {{i+1}}.
                      <v-text-field v-if="editing" class="ml-2" v-model="selectedUtensilsBuf[i]">
                        <template v-slot:append-outer>
                          <!-- <v-btn icon @click="insertUtensil(i+1)">
                            <v-icon small>mdi-plus</v-icon>
                          </v-btn>-->
                          <v-btn icon @click="removeUtensil(i)">
                            <v-icon small>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                      </v-text-field>
                      <span v-else>{{selectedUtensilsBuf[i]}}</span>
                    </v-row>

                    <!-- New utensils -->
                    <v-row v-if="editing" align="center">
                      {{selectedUtensilsBuf.length+1}}.
                      <v-text-field
                        v-model="newUtensilBuf"
                        class="ml-2 pt-2"
                        @change="addUtensil"
                        label="New utensils..."
                      ></v-text-field>
                    </v-row>
                    <v-row class="d-flex flex" v-if="editing && duplicateUtensils.length > 0">
                      <v-col cols="auto">
                        <v-row>
                          <template>{{duplicateUtensilNotificationStr}}</template>
                        </v-row>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn text color="info" @click="fixDuplicateUtensils">Fix it</v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-card-text>
      </v-card>
    </v-col>

    <template v-if="!loading">
      <v-speed-dial v-model="fabMenuOpen" direction="top" bottom right fixed>
        <template v-slot:activator>
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="info" dark fab :v-bind="attrs" v-on="on">
                <v-icon v-if="fabMenuOpen">mdi-menu-down</v-icon>
                <v-icon v-else>mdi-menu-up</v-icon>
              </v-btn>
            </template>
            <span>Edit menu</span>
          </v-tooltip>
        </template>
        <v-tooltip v-for="d in editMenuFabDetails" :key="d.tooltip" left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :v-bind="attrs" v-on="on" :color="d.color" fab small bottom @click="d.onClick()">
              <v-icon>{{d.icon}}</v-icon>
            </v-btn>
          </template>
          <span>{{d.tooltip}}</span>
        </v-tooltip>
      </v-speed-dial>
    </template>

    <v-dialog v-model="confirmDialogOpen">
      <ConfirmCard
        :title="confirmDialogDetails.title"
        :content="confirmDialogDetails.content"
        @confirm="confirmDialogOpen = false; confirmDialogDetails.callback(true)"
        @cancel="confirmDialogOpen = false; confirmDialogDetails.callback(false)"
      />
    </v-dialog>
  </v-card>
</template>

<script>
// import helper from "@/helper";
import LabelChip from "./LabelChip";
import SimpleSearchSection from "./SimpleSearchSection";
import CookingTimeEditDialog from "./CookingTimeEditDialog";
import ConfirmCard from "./ConfirmCard";
import ImageCarousel from "./ImageCarousel";
import Pluralize from "pluralize";
// import { Trie } from "@/types";

export default {
  components: {
    LabelChip,
    SimpleSearchSection,
    CookingTimeEditDialog,
    ConfirmCard,
    ImageCarousel,
  },
  props: {
    loading: Boolean,
    name: {
      type: String,
      default: "",
    },
    editingForce: {
      type: Boolean,
      default: false,
    },
    public: {
      type: Boolean,
      default: false,
    },
    imgSrcs: {
      type: Array,
      default: () => [
        "https://cdn.vuetifyjs.com/images/cards/store.jpg",
        "https://cdn.vuetifyjs.com/images/carousel/bird.jpg",
      ],
    },
    cookingTime: {
      type: Number,
      default: 5,
    },

    ingredientMap: {
      type: Object,
      default: () => ({
        ingredient1: {
          name: "ingredient1",
          unit: "pieces",
          category: "c1",
        },
        ingredient2: {
          name: "ingredient2",
          unit: "gram",
          category: "c2",
        },
        ingredient3: {
          name: "ingredient3",
          unit: "gram",
          category: "c2",
        },
      }),
    },
    mealTypeMap: {
      type: Object,
      default: () => ({
        "gluten free": {
          name: "gluten free",
        },
        "suger free": {
          name: "suger free",
        },
      }),
    },
    cuisineMap: {
      type: Object,
      default: () => ({
        Chinese: {
          name: "Chinese",
        },
        Australian: {
          name: "Australian",
        },
      }),
    },
    utensilMap: {
      type: Array,
      default: () => ({
        wok: {
          name: "wok",
        },
        spoon: {
          name: "spoon",
        },
      }),
    },
    selectedIngredients: {
      type: Array,
      default: () => [
        {
          name: "ingredient1",
          quantity: 200,
          unit: "gram",
        },
      ],
    },
    selectedMealTypes: {
      type: Array,
      default: () => ["gluten free"],
    },
    selectedCuisines: {
      type: Array,
      default: () => [],
    },
    selectedUtensils: {
      type: Array,
      default: () => ["spoon"],
    },
    steps: {
      type: Array,
      default: () => [
        "Step 1........ ............. ............ .................. ................. ............... ...........................",
        "Step 2....",
        "Step 3....",
      ],
    },
  },
  watch: {
    editingForce(val) {
      this.editing = val;
    },
  },
  data() {
    return {
      editing: this.editingForce,

      showCookingTimeDialog: false,

      nameBuf: this.name,
      publicBuf: this.public,
      cookingTimeBuf: this.cookingTime,
      existingImgSrcsBuf: [...this.imgSrcs],
      newImgFiles: [], // File object
      selectedIngredientsBuf: [...this.selectedIngredients],
      selectedMealTypesBuf: [...this.selectedMealTypes],
      selectedCuisinesBuf: [...this.selectedCuisines],
      selectedUtensilsBuf: [...this.selectedUtensils],
      stepsBuf: [...this.steps],

      newStepBuf: "",
      newUtensilBuf: "",
      addIngredientMenuOpen: false,
      addUtensilMenuOpen: false,
      addMealTypeMenuOpen: false,
      addCuisineMenuOpen: false,
      fabMenuOpen: false,
      ingredientHeadersAll: [
        {
          text: "Name",
          align: "start",
          value: "name",
          groupable: false,
        },
        { text: "Category", value: "category", align: "end" },
        { text: "Quantity", value: "quantity", align: "end" },
        { text: "Unit", value: "unit", align: "end" },
        { text: "Action", value: "action", align: "end" },
      ],
      nameRules: [(v) => !!v || "Required"], // const
      confirmDialogOpen: false,
      confirmDialogDetails: {
        title: "",
        content: "",
        callback: () => {},
      },
    };
  },

  computed: {
    missingIngredientNotificationStr() {
      return this.missingIngredientNames.length > 0
        ? `Missing in table: ${this.missingIngredientNames.join(", ")}`
        : null;
    },
    excessiveIngredientNotificationStr() {
      return this.excessiveIngredientNames.length > 0
        ? `Excessive in table: ${this.excessiveIngredientNames.join(", ")}`
        : null;
    },
    missingIngredientNames() {
      let res = [];
      for (const ingredient of Object.keys(this.ingredientInStepsSet)) {
        if (!(ingredient in this.selectedIngredientMap)) {
          res.push(ingredient);
        }
      }
      return res;
    },
    excessiveIngredientNames() {
      let res = [];
      for (const ingredient of Object.keys(this.selectedIngredientMap)) {
        if (!(ingredient in this.ingredientInStepsSet)) {
          res.push(ingredient);
        }
      }
      return res;
    },
    ingredientInStepsSet() {
      let res = {};
      for (const step of this.stepsBuf.concat(this.newStepBuf)) {
        for (const matched of this.extractWordsWithoutLookBehind(
          this.ingredientRegex,
          step
        )) {
          res[Pluralize.singular(matched)] = 1;
        }
      }
      return res;
    },
    selectedIngredientMap() {
      return this.selectedIngredientsBuf.reduce((res, v) => {
        res[v.name] = v;
        return res;
      }, {});
    },

    missingUtensilsStr() {
      const s = this.missingUtensilsNames.reduce((res, v) => {
        return res.concat(`${v}, `);
      }, "");
      return `Missing utensils: ${s}`;
    },

    missingUtensilsNames() {
      return this.extractMissingItemsFromSteps(
        this.utensilNameMap,
        this.selectedUtensilNameMap
      );
    },

    utensilNameMap() {
      return this.utensilMap;
    },

    selectedUtensilNameMap() {
      return this.selectedUtensilsBuf.reduce((res, v) => {
        res[this.utensilMap[v].name] = v;
        return res;
      }, {});
    },

    selectedIngredientItems() {
      return this.selectedIngredientsBuf;
    },
    selectedUtensilItems() {
      return [];
      // return this.selectedUtensilsBuf.map((k) => {
      //   return this.utensilMap[k];
      // });
    },
    selectedMealTypeItems() {
      return this.selectedMealTypesBuf.map((k) => {
        return this.mealTypeMap[k];
      });
    },
    selectedCuisineItems() {
      return this.selectedCuisinesBuf.map((k) => {
        return this.cuisineMap[k];
      });
    },
    ingredientHierarchy() {
      const res = {};
      for (const v of Object.values(this.ingredientMap)) {
        if (!(v.category in res)) {
          res[v.category] = [];
        }
        res[v.category].push(v);
      }
      return res;
    },

    ingredientRegex() {
      let reg = "";
      for (const ingredient of Object.keys(this.ingredientMap)) {
        reg = reg.concat(ingredient, "|", Pluralize.plural(ingredient), "|");
      }
      reg = "(^|\\W)(" + reg.slice(0, -1) + ")(?=$|\\W)";
      return new RegExp(reg, "gi");
    },

    // ingredientTrie() {
    //   let trie = new Trie();
    //   for (const k of Object.keys(this.ingredientMap)) {
    //     trie.insert(k);
    //     trie.insert(Pluralize.plural(k), k);
    //   }
    //   return trie;
    // },
    duplicateUtensilNotificationStr() {
      return "Duplicate: ".concat(this.duplicateUtensils.join(", "));
    },
    duplicateUtensils() {
      const map = {};
      const repeated = [];
      for (const utensil of this.selectedUtensilsBuf) {
        if (utensil in map) {
          repeated.push(utensil);
        } else {
          map[utensil] = 0;
        }
      }
      console.log(repeated);
      return repeated;
    },

    // Table headers for ingredient table
    ingredientHeaders() {
      return this.editing
        ? this.ingredientHeadersAll
        : this.ingredientHeadersAll.slice(
            0,
            this.ingredientHeadersAll.length - 1
          );
    },

    editMenuFabDetails() {
      if (this.editing) {
        return [
          {
            color: "success",
            icon: "mdi-check",
            tooltip: "confirm",
            onClick: this.triggerConfirmEdit,
          },
          {
            color: "warning",
            icon: "mdi-backup-restore",
            tooltip: "undo all",
            onClick: this.triggerResetEdit,
          },
          {
            color: "error",
            icon: "mdi-close",
            tooltip: "cancel",
            onClick: this.triggerCancelEdit,
          },
        ];
      }
      return [
        {
          color: "warning",
          icon: "mdi-pencil",
          tooltip: "edit recipe",
          onClick: this.triggerStartEdit,
        },
        {
          color: "error",
          icon: "mdi-close",
          tooltip: "delete recipe",
          onClick: this.triggerDelete,
        },
      ];
    },
  },

  methods: {
    extractWordsWithoutLookBehind(regExp, text) {
      if (!regExp || !text) {
        return [];
      }
      regExp.lastIndex = 0;
      let res = [];
      for (
        let matchingRes = regExp.exec(text);
        matchingRes;
        matchingRes = regExp.exec(text)
      ) {
        const word = matchingRes[0];
        res.push(word.search(/^\w/) !== -1 ? word : word.slice(1));
      }
      return res;
    },
    extractMissingItemsFromSteps(includeNameMap, excludeNameMap) {
      var words = [];
      for (const step of this.stepsBuf.concat(this.newStepBuf)) {
        const step_list = step
          .replace(/([ \s.,;]+)/g, "$1¡ìsep¡ì")
          .split("¡ìsep¡ì")
          .map((x) => x.trim());

        const missingNames = step_list
          .map((v) => Pluralize.singular(v.toLowerCase()))
          .filter((v) => {
            return v in includeNameMap && !(v in excludeNameMap);
          });
        words = words.concat(missingNames);
      }
      return [...new Set(words)];
    },

    fixIngredientMatching() {
      for (const name of this.excessiveIngredientNames) {
        this.removeIngredient(this.ingredientMap[name]);
      }
      for (const name of this.missingIngredientNames) {
        this.addIngredient(this.ingredientMap[name]);
      }
    },

    fixDuplicateUtensils() {
      for (const name of this.duplicateUtensils) {
        const i = this.selectedUtensilsBuf.lastIndexOf(name);
        if (i === -1) {
          console.warn("Error in fixing duplicate utensils");
        }
        this.selectedUtensilsBuf.splice(i, 1);
      }
    },

    imgsModified() {
      return (
        !this.existingImgSrcsBuf.equals(this.imgSrcs) ||
        !this.newImgFiles.equals([])
      );
    },

    contentModified() {
      return (
        this.nameBuf !== this.name ||
        this.publicBuf !== this.public ||
        this.cookingTimeBuf !== this.cookingTime ||
        !this.selectedIngredientsBuf.equals(this.selectedIngredients) ||
        !this.selectedMealTypesBuf.equals(this.selectedMealTypes) ||
        !this.selectedCuisinesBuf.equals(this.selectedCuisines) ||
        !this.selectedUtensilsBuf.equals(this.selectedUtensils) ||
        !this.stepsBuf.equals(this.steps)
      );
    },
    triggerStartEdit() {
      this.editing = true;
    },
    triggerCancelEdit() {
      const imgsModified = this.imgsModified();
      const contentModified = this.contentModified();
      if (!contentModified && !imgsModified) {
        this.$emit("cancel", false);
        this.editing = false;
        return;
      }
      this.confirmDialogDetails.title = "Cancel update";
      this.confirmDialogDetails.content = "Should proceed?";
      this.confirmDialogDetails.callback = this.cancelEdit;
      this.confirmDialogOpen = true;
    },
    triggerResetEdit() {
      const imgsModified = this.imgsModified();
      const contentModified = this.contentModified();
      if (!contentModified && !imgsModified) {
        this.$emit("reset", false);
        return;
      }
      this.confirmDialogDetails.title = "Reset";
      this.confirmDialogDetails.content = "Should proceed?";
      this.confirmDialogDetails.callback = this.resetEdit;
      this.confirmDialogOpen = true;
    },
    triggerConfirmEdit() {
      if (!this.$refs.editForm.validate()) {
        this.$emit("errorMsg", "Recipe name is required");
        return;
      }
      const imgsModified = this.imgsModified();
      const contentModified = this.contentModified();
      if (!contentModified && !imgsModified) {
        this.$emit("confirm", null);
        this.editing = false;
        return;
      }
      this.confirmDialogDetails.title = "Confirm update";
      this.confirmDialogDetails.content = "Should proceed?";
      this.confirmDialogDetails.callback = this.confirmEdit;
      this.confirmDialogOpen = true;
    },

    triggerDelete() {
      this.confirmDialogDetails.title = "Confirm delete";
      this.confirmDialogDetails.content = "Should proceed?";
      this.confirmDialogDetails.callback = this.confirmDelete;
      this.confirmDialogOpen = true;
    },

    cancelEdit(shouldCommit) {
      if (!shouldCommit) return;
      this.$emit("cancel", true);
      this.resetContent();
      this.editing = false;
    },
    resetEdit(shouldCommit) {
      if (!shouldCommit) return;
      this.$emit("reset", true);
      this.resetContent();
    },
    confirmEdit(shouldCommit) {
      if (!shouldCommit) return;
      this.editing = false;
      const returnedRes = {};

      if (this.imgsModified()) {
        returnedRes["images"] = {
          deleteImageUrls: [
            ...this.imgSrcs.filter((e) => !this.existingImgSrcsBuf.includes(e)),
          ],
          newImageFiles: [...this.newImgFiles],
        };
      }
      if (this.contentModified()) {
        returnedRes["content"] = {
          name: this.nameBuf,
          public: this.publicBuf,
          time: this.cookingTimeBuf,
          ingredients: [...this.selectedIngredientsBuf],
          mealTypes: [...this.selectedMealTypesBuf],
          cuisines: [...this.selectedCuisinesBuf],
          utensils: [...this.selectedUtensilsBuf],
          steps: [...this.stepsBuf],
        };
      }
      this.$emit("confirm", returnedRes);
    },
    confirmDelete(shouldCommit) {
      if (!shouldCommit) return;
      this.$emit("delete");
    },

    updateCookingTime(val) {
      this.cookingTimeBuf = val;
    },

    resetCookingTime() {
      this.cookingTimeBuf = null;
    },

    addStep(newStep) {
      if (!newStep) {
        return;
      }
      this.stepsBuf.push(newStep);
      this.newStepBuf = "";
    },

    insertStep(index) {
      this.stepsBuf.splice(index, 0, "");
    },

    removeStep(index) {
      this.stepsBuf.splice(index, 1);
    },

    addUtensil(newUtensil) {
      if (!newUtensil) {
        return;
      }
      this.selectedUtensilsBuf.push(newUtensil);
      this.newUtensilBuf = "";
    },

    insertUtensil(index) {
      this.selectedUtensilsBuf.splice(index, 0, "");
    },

    removeUtensil(index) {
      this.selectedUtensilsBuf.splice(index, 1);
    },

    addIngredient(item) {
      this.selectedIngredientsBuf.push({ ...item, quantity: "", unit: "" });
    },
    removeIngredient(item) {
      const i = this.selectedIngredientsBuf.findIndex(
        (v) => v.name === item.name
      );
      if (i === -1) return;
      this.selectedIngredientsBuf.splice(i, 1);
    },

    addMealType(item) {
      this.addMealTypeMenuOpen = false;
      this.selectedMealTypesBuf.push(item);
      setTimeout(() => {
        this.addMealTypeMenuOpen = true;
      });
    },
    removeMealType(item) {
      const i = this.selectedMealTypesBuf.indexOf(item);
      if (i === -1) return;
      this.selectedMealTypesBuf.splice(i, 1);
    },
    addCuisine(item) {
      this.addCuisineMenuOpen = false;
      this.selectedCuisinesBuf.push(item);
      setTimeout(() => {
        this.addCuisineMenuOpen = true;
      });
    },
    removeCuisine(item) {
      const i = this.selectedCuisinesBuf.indexOf(item);
      if (i === -1) return;
      this.selectedCuisinesBuf.splice(i, 1);
    },

    addImage(file) {
      this.newImgFiles.push(file);
    },

    removeImage(v) {
      const buf =
        v instanceof File ? this.newImgFiles : this.existingImgSrcsBuf;
      const i = buf.indexOf(v);
      if (i === -1) return;
      buf.splice(i, 1);
    },
    addUtensilWhenMenuOpen(item) {
      this.addUtensilMenuOpen = false;
      this.addUtensil(item);
      setTimeout(() => {
        this.addUtensilMenuOpen = true;
      });
    },
    addIngredientWhenMenuOpen(item) {
      this.addIngredientMenuOpen = false;
      this.addIngredient(item);
      setTimeout(() => {
        this.addIngredientMenuOpen = true;
      });
    },

    resetContent() {
      this.existingImgSrcsBuf = [...this.imgSrcs];
      this.newImgFiles = [];
      this.nameBuf = this.name;
      this.publicBuf = this.public;
      this.cookingTimeBuf = this.cookingTime;
      this.selectedIngredientsBuf = [...this.selectedIngredients];
      this.selectedMealTypesBuf = [...this.selectedMealTypes];
      this.selectedCuisinesBuf = [...this.selectedCuisines];
      this.selectedUtensilsBuf = [...this.selectedUtensils];
      this.stepsBuf = [...this.steps];
    },
  },
};
</script>
