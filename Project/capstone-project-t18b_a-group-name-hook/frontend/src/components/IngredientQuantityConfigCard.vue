<template>
    <v-card>
      <v-card-title class="headline">Set quantity ({{label !== null ?label.name: ""}})</v-card-title>
      <v-card-text class="justify-center">
        <!-- <v-slider
          v-model="val"
          :max="max"
          :min="min"
          hide-details
          label="Quantity"
          class="align-center"
        >
          <template v-slot:append>
            <v-text-field
              v-model="val"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
            ></v-text-field>
          </template>
        </v-slider>-->
        <v-container>
          <v-row justify="center">
            <v-form v-model="valid">
              <v-text-field
                v-model="val"
                single-line
                type="number"
                label="Quantity"
                :rules="rules"
                required
              ></v-text-field>
            </v-form>
          </v-row>
          <v-row justiy="end">
            Intepreted as: {{val === "" ? "": parseFloat(val)}}
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="complete(false)">Cancel</v-btn>
        <v-btn color="green darken-1" text :disabled="!valid" @click="complete(true)">Confirm</v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>
import {roundDP, countDecimals} from "@/helper"
export default {
  props: {
    label: Object,
    initQuantity: {
      type:Number,
      default: 1,
    },
    min: {
      type:Number,
      default: null,
    },
    decimalPlaces: {
      type:Number,
      default:0,
    }
  },
  data() {
    return {
      val: this.initQuantity,    
      rules: [
        v => !!v || "Quantity cannot be empty",
        v => /^[+-]?\d[0-9,.]*$/.test(v) || "Quantity is a number",
        v => (this.min === null || this.parseVal(v) >= this.min) || `Quantity must be greater than ${this.min}`,
        v => countDecimals(v) <= this.decimalPlaces || `Quantity is too many decimal places (Max: ${this.decimalPlaces})`,
      ],
      valid: true
    };
  },
  methods: {
    complete(hasConfirm) {
      if (hasConfirm) {
        this.$emit("confirm", this.parseVal(this.val));
      } else {
        this.$emit("cancel");
      }
    },
    parseVal(val) {
      return roundDP(val, this.decimalPlaces);
    }
  }
};
</script>

<style>
</style>