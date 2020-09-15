<template>
  <v-card outlined>
    <v-container fluid>
      <v-row align="center" justify="space-around">
        <v-col cols="12" class="py-0">
          <v-text-field v-model="query" label="Search" clearable></v-text-field>
        </v-col>
      </v-row>

      <v-expansion-panels v-if="showHierarchy" :value="panel">
        <v-expansion-panel v-for="categoryKey of Object.keys(searchItems)" :key="categoryKey">
          <v-expansion-panel-header>{{categoryKey}}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container fluid>
              <v-row>
                <span v-for="item of searchItems[categoryKey]" :key="item[keyName]">
                  <LabelChip
                    v-if="!excludeSelected || !((isStr(item) ? item: item.name) in selectedIDMap)"
                    :label="item"
                    @select="$emit('select', item)"
                    @unselect="$emit('unselect', item)"
                  />
                </span>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-container v-else fluid>
        <v-row>
          <template v-if="maxAppearance === null || filteredSearchItems.length <=maxAppearance">
              <LabelChip
                v-for="item of filteredSearchItems"
                :key="item[keyName]"
                :label="item"
                @select="$emit('select', item)"
                @unselect="$emit('unselect', item)"
              />
          </template>
          <template v-else>
            <span>There are {{filteredSearchItems.length }} matching ingredients. Please be more specific.</span>
          </template>
        </v-row>
      </v-container>
    </v-container>
  </v-card>
</template>

<script>
import LabelChip from "./LabelChip";
import Helper from "@/helper";
export default {
  components: { LabelChip },
  props: {
    excludeSelected: {
      type: Boolean,
      default: true,
    },
    searchItems: {
      default: [],
    },
    keyName: {
      type: String,
      default: "name",
    },
    selectedKeys: {
      type: Array,
      default: () => [],
    },
    maxAppearance: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      query: "",
      panel: null,
    };
  },

  computed: {
    noQuery() {
      return this.query === null || this.query === "";
    },
    showHierarchy() {
      return !(this.searchItems instanceof Array) && this.noQuery;
    },
    selectedIDMap() {
      return this.selectedKeys.reduce((map, key) => {
        map[key] = key;
        return map;
      }, {});
    },

    filteredSearchItems() {
      if (this.showHierarchy) return this.searchItems;
      const m =
        this.searchItems instanceof Array
          ? { dummy: this.searchItems }
          : this.searchItems;
      const filtered = [];
      for (const cat of Object.keys(m)) {
        for (const item of m[cat]) {
          const name = Helper.isStr(item) ? item : item.name;
          if (
            (!this.excludeSelected || !(name in this.selectedIDMap)) &&
            Helper.isMatchQuery(name, this.query)
          ) {
            filtered.push(item);
          }
        }
      }
      return filtered;
    },
  },

  methods: {
    isStr(s) {
      return Helper.isStr(s);
    },
  },
};
</script>