<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("route/handleIncorrectURL")
  },
}
</script>

<style>

</style>