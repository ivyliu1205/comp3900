<template>
  <v-app>
    <AppBar v-if="visible" />
    <slot></slot>
    <SnakeBarMessage />
    <Footer v-if="visible" />
  </v-app>
</template>

<script>
import AppBar from "./AppBar";
import Footer from "./Footer";
import SnakeBarMessage from "@/components/SnakeBarMessage";
export default {
  components: { AppBar, SnakeBarMessage, Footer },
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style>
</style>