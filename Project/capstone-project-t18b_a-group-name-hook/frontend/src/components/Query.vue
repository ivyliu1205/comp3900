<template>
  <div>
    <span class="inline">{{textList[0]}}</span>
    <span class="inline" v-for="[i,t] of textList.splice(1).entries()" :key="i">
      <span class="inline highlighted" v-if="i  % 2 === 0">{{t}}</span>
      <span class="inline" v-else>{{t}}</span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    searchTerm: {
      type: String,
      default: ""
    }
  },

  computed: {
    textList() {
      let text = this.text;
      if (this.searchTerm.length === 0) {
        return [this.text];
      }
      let res = [];
      let reg = new RegExp("(?=" + this.searchTerm + ")", "i");
      for (
        let index = text.search(reg);
        index !== -1;
        index = text.search(reg)
      ) {
        res.push(text.slice(0, index));
        res.push(text.slice(index, index+this.searchTerm.length));
        text = text.slice(index + this.searchTerm.length);
      }
      res.push(text);

      return res;
    }
  }
};
</script>

<style scoped>
.inline {
  display: inline;
}

.highlighted {
  background-color: #ffff00;
}
</style>