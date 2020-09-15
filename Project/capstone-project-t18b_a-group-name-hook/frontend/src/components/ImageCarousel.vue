<template>
  <v-container class="pa-0">
    <v-col class="pa-0">
      <v-carousel :cycle="cycle" :width="width" :height="height" :hide-delimiters="hideDelimiters" hide-delimiter-background :show-arrows="showArrows" show-arrows-on-hover>
        <v-carousel-item
          v-for="(img,i) in imgs"
          :key="i"
          :src="typeof(img) === 'object' ? URLref.createObjectURL(img): img"
        >
          <!-- For some reason the fab button overflows the top of the images -->
          <v-btn
            v-if="editing"
            class="mt-8"
            color="rgba(238, 238, 238, 0.8)"
            absolute
            fab
            small
            top
            right
            @click="onImageRemoved(img)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-carousel-item>

        <v-carousel-item v-if="imgs.length === 0">
          <v-overlay absolute>
            Currently there is no image
            <v-btn
              v-if="editing"
              class="black--text"
              color="rgb(238, 238, 238) "
              block
              @click="$refs.fileInput.click()"
            >Add Image</v-btn>
          </v-overlay>
        </v-carousel-item>
      </v-carousel>
      <template v-if="editing">
        <input
          style="display:none"
          type="file"
          :accept="supportTypesString"
          @change="onImageSelected"
          ref="fileInput"
        />
        <v-btn
          v-if="editing"
          color="rgb(238, 238, 238)"
          block
          @click="$refs.fileInput.click()"
        >Add Image</v-btn>
      </template>
    </v-col>
  </v-container>
</template>

<script>
export default {
  props: {
    editing: {
      type: Boolean,
      default: false
    },
    
    imgs: {
      type: Array,
      default: () => [
        "https://cdn.vuetifyjs.com/images/cards/store.jpg",
        "https://cdn.vuetifyjs.com/images/carousel/bird.jpg"
      ]
    },
    width: {
      type: Number,
      default: 800,
    },
    height: {
      type: Number,
      default: 600,
    },
    cycle: {
      type: Boolean,
      default: false
    },
    supportedTypes: {
      type: Array,
      default: () => ["jpg", "jpeg", "png"]
    },
    showArrows: {
      type: Boolean,
      default: true
    },
    hideDelimiters:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      URLref: URL // Workaround to bypass the issue that URL cannot be directly referred in the Vue template
    };
  },
  computed: {
    supportTypesString() {
      return this.supportedTypes.reduce((s, v) => {
        return s.concat(".", v, ", ");
      }, "");
    }
  },
  methods: {
    onImageSelected(e) {
      const f = e.target.files[0];
      const splited = f.name.split(".");
      if (splited.length <= 1 || !this.supportedTypes.includes(splited[1])) {
        console.log("File type is not recognised");
        this.$emit("addUnsupportedImageFileWarning", f);
        return;
      }
      this.$emit("addImage", f);
    },
    onImageRemoved(img) {
      this.$emit("removeImage", img);
    }
  }
};
</script>

<style>
</style>