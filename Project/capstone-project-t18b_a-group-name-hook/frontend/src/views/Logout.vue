<template>
  <v-main>
    <v-card :loading="loading" class="mx-auto my-0 pa-0 fill-height fill-width">
      <div></div>
    </v-card>
  </v-main>
</template>

<script>
import { mapState } from "vuex";
export default {
  mounted() {
    this.$store.dispatch("profile/logout");
  },

  computed: {
    ...mapState({
      loading: (state) => state.global.loading,
    }),
  },
};
</script>

<style>
</style>