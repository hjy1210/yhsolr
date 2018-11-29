var app = new Vue({
    el: '#app',
    data: {
        highlights: '',
        snippets: 3,
        q: '',
        start: 0,
        rows: 4,
        numFound: 0,
        error: ""
    },
    methods: {
        search: function () {
            this.error = "";
            this.highlights = "";
            this.numFound = 0;
            axios.get("http://192.168.182.80:8983/solr/allsortofdocuments/select", {
                params: {
                    q: this.q,
                    fl: "id",
                    start: this.start * this.rows,
                    rows: this.rows,
                    hl: true,
                    "hl.method":"unified",
                    "hl.fl": "content",
                    "hl.snippets": this.snippets,
                    "hl.tag.pre":"<b>",
                    "hl.tag.post":"</b>"
                }
            })
                .then(this.onSucceed, this.onError);

        },
        startSearch: function(){
            this.start=0;
            this.search();
        },
        getFileLink: function (file) {
            file = file.replace("\\", "/");
            return "http://192.168.182.80:9001/"+file.substring("d:/data/".length);
        },
        prevPage: function () {
            this.start = this.start - 1;
            this.search();
        },
        nextPage: function () {
            this.start = this.start + 1;
            this.search();
        },
        getHighLight: function (file) {
            return this.highlights[file].content;
        },
        onSucceed: function (result) {
            this.highlights = result.data.highlighting;
            this.numFound = result.data.response.numFound;
        },
        onError: function (error) {
            this.error = "" + error;
            console.log(error);
        }
    }
})