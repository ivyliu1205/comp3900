<template>
  <v-dialog :value="open" width="300">
    <v-card class="fill-width fill-height">
      <v-card-title>
        <span class="headline">{{title}}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row class="ma-4">
            <v-slider v-model="cookingTimeBuf" thumb-label="always" min="5" step="5" max="120"></v-slider>min
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="reset">Reset</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="cancel">Close</v-btn>
        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props:{
    title: {
      type: String,
      default: "Change cooking time",
    },
    cookingTime: {
      type:Number,
      default: 0,
    },
    open: {
      type:Boolean,
      default:false
    }
  },
  watch: {
    // open(val) {
    //   console.log("BBB");
    //   this.dialog = val
    // },
    cookingTime(val) {
      this.cookingTimeBuf = val
    }
  },
  data() {
    return {
      cookingTimeBuf: this.cookingTime,
      // dialog: open,
    }
  },
  methods: {
    save() {
      this.$emit("save", this.cookingTimeBuf)
      this.$emit('update:open', false)
      // this.dialog = false
    },
    cancel() {
      this.$emit("cancel")
      this.$emit('update:open', false)
      this.cookingTimeBuf = this.cookingTime
      // this.dialog = false
    },
    reset() {
      this.$emit("reset")
      this.$emit('update:open', false)
      this.cookingTimeBuf = null
      // this.dialog = false
    }
  },
};
</script>

<style>
</style>