new Vue({
  el: '#notebook',
  data () {
    return {
      content: 'This is a note. You can type in here.',
    }
  },
  computed: {
    notePreview () {
      return marked(this.content);
    },
  },
    // (2) We can now use the method name in the handler option of our watcher:
  watch: {
    content: {
      handler: 'saveNote',
    },
  },
  // (1) USING A METHOD
  // We can write some logic in reusable functions called METHODS.
  // Let's move our saving logic into one:
  // Add a new METHODS option to the Vue instance and use the localStorage API there:
  methods: {
    saveNote (val) {
      console.log('saving note', val);
      localStorage.setItem('content', val);
    },
  },
})