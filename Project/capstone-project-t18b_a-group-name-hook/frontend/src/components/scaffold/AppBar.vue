
<template>
  <div>
    <v-navigation-drawer v-model="drawerOpen" app clipped>
      <v-list dense>
        <v-list-item-group :value="currentNavLinkSelectedIndex" color="primary">
          <v-list-item
            v-for="item of navlinks"
            :key="item.name"
            active-class="selected"
            :class="$router.currentRoute.path.toLowerCase() === item.link.toLowerCase() ? 'selected': ''"
            @click="toRoute(item.link)"
          >
            <v-list-item-avatar>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app clipped-left dense>
      <v-app-bar-nav-icon @click="drawerOpen = !drawerOpen"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <button :click="toHomePage">
          <span class="text-h3" @click="toHomePage">MealMatch</span>
        </button>
        <span class="text-subtitle-1">{{subTitle}}</span>
      </v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      drawerOpen: false,
    };
  },
  computed: {
    ...mapGetters({
      navlinks: "route/mainRoutes",
      subTitle: "route/routeSubTitle",
      currentNavLinkSelectedIndex: "route/currentNavLinkSelectedIndex",
    }),
  },

  methods: {
    toRoute(route) {
      this.drawerOpen = false;
      this.$store.dispatch("route/to", route);
    },
    toHomePage() {
      this.$store.dispatch("route/to", "/")
    },
  },
};
</script>

<style scoped>
</style>