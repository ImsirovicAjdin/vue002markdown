new Vue({
  el: '#notebook',
  data () {
    return {
      content: localStorage.getItem('content') || 'You can write in **markdown**',
      // NEW! A NOTE ARRAY:
      notes: [],
    }
  },
  computed: {
    notePreview () {
      return marked(this.content);
    },
  },
  watch: {
    content:'saveNote',
  },
  methods: {
    saveNote () {
      console.log('saving note', this.content);
      localStorage.setItem('content', this.content);
      this.reportOperation('saving');
    },
    reportOperation (opName) {
      console.log('The', opName, 'operation was completed!');
    },
  },
})