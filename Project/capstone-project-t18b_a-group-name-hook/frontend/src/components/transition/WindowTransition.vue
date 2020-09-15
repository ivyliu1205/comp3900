<template>
  <transition :name="routeTransition" @enter="enter" @after-enter="afterEnter" @leave="leave">
    <slot />
  </transition>
</template>

<script>
// Implementation is based on: https://markus.oberlehner.net/blog/transition-to-height-auto-with-vue/
export default {
  data() {
    return {
      routeTransition: "slide-up",
    }
  },
   watch: {
    '$route' (to, from) {
      if(from.name === "Welcome") {
        this.routeTransition = "slide-up"
      } else {
        this.routeTransition = "fade-in-out"
      }
    }
  },
  methods: {
    enter(element) {
      if(this.routeTransition !== "slide-up") {
        return;
      }
      
      const width = getComputedStyle(element).width;
      element.style.width = width;
      element.style.position = "absolute";
      element.style.visibility = "hidden";
      element.style.height = "auto";

      const height = getComputedStyle(element).height;

      element.style.width = null;
      element.style.position = null;
      element.style.visibility = null;
      element.style.height = 0;

      // Force repaint to make sure the
      // animation is triggered correctly.
      getComputedStyle(element).height;


      // Trigger the animation.
      // We use `requestAnimationFrame` because we need
      // to make sure the browser has finished
      // painting after setting the `height`
      // to `0` in the line above.
      requestAnimationFrame(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = "auto";
    },
    leave(element) {
      if(this.routeTransition !== "slide-up") {
        return;
      }
      const height = getComputedStyle(element).height;

      element.style.height = height;

      // Force repaint to make sure the
      // animation is triggered correctly.
      getComputedStyle(element).height;

      requestAnimationFrame(() => {
        element.style.height = 0;
      });
    }
  }
};
</script>

<style scoped>
/* slide up (from welcome page) */
.slide-up-enter-active {
  transition: height 1s ease-in-out;
  overflow: hidden;
}
.slide-up-leave-active {
  transition: height 1s ease-in-out;
  overflow: hidden;
}
.slide-up-enter ,
.slide-up-leave-to {
  height: 0;
}
/* fade in out (typical) */
.fade-in-out-enter-active {
  transition: opacity .3s ease-in-out;
  overflow: hidden;
}
.fade-in-out-leave-active {
  transition: opacity .3s ease-in-out;
  overflow: hidden;
}
.fade-in-out-enter {
  opacity: 0;
}
.fade-in-out-enter-to {
  opacity: 1;
}
.fade-in-out-leave-to {
  opacity: 0;
}
</style>