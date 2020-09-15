<template>
  <v-card >
    <v-card-title class="headline">{{title}}</v-card-title>

    <v-card-text>{{content}}</v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="cancel">{{cancelActionString}}</v-btn>
      <v-btn color="green darken-1" text @click="confirm">{{confirmActionString}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    confirmActionString: {
      type: String,
      default: "Confirm"
    },
    cancelActionString: {
      type: String,
      default: "Cancel"
    }
  },
  methods: {
    confirm(v) {
      this.$emit("confirm", v);
    },
    cancel(v) {
      this.$emit("cancel", v);
    }
  }
};
</script>

<style>
</style>