<template>
  <v-snackbar
    v-model="snackbar"
    bottom
    :color="msgBuffer.type === null || msgBuffer.type === undefined ? 'info': msgBuffer.type"
    :multi-line="$vuetify.breakpoint.mobile"
    :timeout="msgBuffer.timeout === null || msgBuffer.timeout === undefined ? -1: msgBuffer.timeout"
  >
    {{ msgBuffer.content }}
    <template v-slot:action="{ attrs }">
      <v-btn dark text v-bind="attrs" @click="snackbar = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script>
// import { mapState } from "vuex";
export default {
  data() {
    return {
      msgBuffer: { type: null, content: "", timeout: null },
      snackbar: false
    };
  },
  watch: {
    msg(v) {
      this.msgBuffer = v ? v: {typs:'info', content: '',timeout: 4000 };
      this.snackbar = v && v.content;
    }
  },
  computed: {
    msg() {
      return this.$store.state.global.msg;
    }
  }
};
</script>

<style>
</style>