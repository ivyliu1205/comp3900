<template>
  <div>
    <!-- <template v-if="enableMenu">
      <v-menu
        :disabled="disabled"
        bottom
        :close-on-content-click="false"
        transition="scale-transition"
        origin="top center"
        allow-overflow
        :value="menuOpen"
      >
        <template v-slot:activator="{}">
          <v-chip
            :disabled="disabled"
            class="ma-2"
            :color="color"
            :text-color="selected ? 'white': color"
            :outlined="!selected"
            :close="closable"
            @click="menuOpen = true"
            @click:close="$emit('unselect', label)"
          >{{label.name}}</v-chip>
        </template>
        <IngredientQuantityConfigCard
          :label="label"
          :default="label.quantity"
          @confirm="(q) => { $emit('select',{label: label, quantity: parseInt(q)}); menuOpen = false}"
          @cancel="() => menuOpen = false"
        />
      </v-menu>
    </template> -->
    <template>
      <template>
        <v-chip
          :disabled="disabled"
          class="ma-2"
          :color="color"
          :text-color="selected ? 'white': color"
          :outlined="!selected"
          :close="closable"
          @click="$emit('select', label)"
          @click:close="$emit('unselect', label)"
        >{{isStr(label) ? label: label.name}}</v-chip>
      </template>
    </template>
  </div>
</template>

<script>
import Helper from "@/helper";
export default {
  components: {  },
  props: {
    enableMenu: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      default: "indigo",
    },
    selected: {
      default: false,
    },
    closable: {
      default: false,
    },
    label: {
      default: () => ({
        name: -1,
      }),
    },
  },
  data() {
    return {
      menuOpen: false,
    };
  },
  methods: {
    isStr(s) {
      return Helper.isStr(s)
    }
  },
};
</script>

<style>
</style>