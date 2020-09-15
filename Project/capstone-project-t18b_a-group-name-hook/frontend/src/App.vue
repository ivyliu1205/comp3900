<template>
  <Scaffold :visible="appBarFooterVisible">
    <WindowTransition>
      <router-view :key="$route.fullPath" class="mx-0"></router-view>
    </WindowTransition>
  </Scaffold>
</template>

<script>
import Vue from "vue";
import Scaffold from "@/components/scaffold/Scaffold";
import WindowTransition from "@/components/transition/WindowTransition";
import { mapGetters } from "vuex";

import eventBus from "@/virtual/event_bus.js";
export default {
  name: "App",
  components: { WindowTransition, Scaffold },
  created() {
    this.$store.dispatch("fetchLabels");
    this.$store.dispatch("profile/loginCheck");

    // frontend-wise callback initialization
    this.$router.afterEach((to) => {
      // Bind route update to Vuex
      if (to.name !== null) {
        this.$store.commit("route/updateRoute", to);
      }

      // Update title of html
      Vue.nextTick(() => {
        document.title = to.meta.title || "MealMatch";
      });
    });

    // Bind token update to Vuex
    eventBus.$on("updateToken", () => {
      this.$store.commit("profile/setIsLogin", true);
    });
    eventBus.$on("revokeToken", () => {
      this.$store.commit("profile/setIsLogin", false);
    });

    // Bind remote authentication failure to Vuex
    eventBus.$on("onRemoteAuthFail", () => {
      this.$store.dispatch("profile/fallBackWhenNotLogin", null);
    });
  },

  computed: {
    ...mapGetters({
      appBarFooterVisible: "route/appBarFooterVisible",
    }),
  },
};
</script>


<style scoped>
.hd {
  border-top: 3px solid grey;
}
.vd {
  border-left: 3px solid grey;
}
.selected {
  color: blue;
}
.unselected {
  color: grey;
}
</style>