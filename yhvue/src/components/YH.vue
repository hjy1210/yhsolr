<template>
<div>
  <div class="yh">
    <p>桌面查詢系統</p>
    <div>
      <span>搜尋字串:</span>
      <input v-model="q">
      <button v-on:click="startSearch">搜尋</button>
    </div>
    <div v-if="error.length > 0">{{error}}</div>
    <div v-if="numFound > 0">
      <button v-bind:disabled="start <= 0" v-on:click="prevPage">前一頁</button>
      <span>共 {{numFound}} 筆，每頁 {{rows}} 筆，第 {{start+1}} 頁</span>
      <button v-bind:disabled="start >= Math.ceil(numFound/rows)-1" v-on:click="nextPage">下一頁</button>
    </div>
    <div v-for="(obj,ind) in docs" :key="ind">
      <span>({{obj.score}})&nbsp;</span><a v-bind:href="getFileLink(obj.id)" target="_blank">{{obj.id}}</a>
      <div v-for="(ps,i) in highlights[obj.id]" :key="i">
        <p v-for="(p,j) in ps" v-html="p" :key="j"></p>
      </div>
      <hr>
    </div>
  </div>
</div>
</template>

<script>
import axios from "axios";
export default {
  name: "YH",
  props: {
    msg: String
  },
  data: function() {
    return {
      highlights: "",
      snippets: 3,
      docs:"",
      q: "",
      start: 0,
      rows: 4,
      numFound: 0,
      error: ""
    };
  },
  methods: {
    search: function() {
      this.error = "";
      this.highlights = "";
      this.docs="";
      this.numFound = 0;
      axios
        .get("http://192.168.182.80:8983/solr/allsortofdocuments/select", {
          params: {
            q: this.q,
            fl: "id score",
            start: this.start * this.rows,
            rows: this.rows,
            hl: true,
            "hl.method": "unified",
            "hl.fl": "content",
            "hl.snippets": this.snippets,
            "hl.tag.pre": "<b>",
            "hl.tag.post": "</b>"
          }
        })
        .then(this.onSucceed, this.onError);
    },
    startSearch: function() {
      this.start = 0;
      this.search();
    },
    getFileLink: function(file) {
      file = file.replace("\\", "/");
      return "http://192.168.182.80:9001/" + file.substring("d:/data/".length);
    },
    prevPage: function() {
      this.start = this.start - 1;
      this.search();
    },
    nextPage: function() {
      this.start = this.start + 1;
      this.search();
    },
    onSucceed: function(result) {
      this.highlights = result.data.highlighting;
      this.numFound = result.data.response.numFound;
      this.docs=result.data.response.docs;
    },
    onError: function(error) {
      this.error = "" + error;
      console.log(error);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
