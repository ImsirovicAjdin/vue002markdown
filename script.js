new Vue({
  el: '#notebook',
  data () {
    return {
      // INITIALIZING DIRECTLY IN THE DATA:
      // The other way to display the saved localStorage is to initialize the CONTENT data
      // property with the restored value directly:
      content: localStorage.getItem('content') || 'You can write in **markdown**',
      // With the preceding code, the watcher hander will not be called because we initialize
      // the content value instead of changing it
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