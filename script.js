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
  watch: {
    content:'saveNote',
  },
  methods: {
    // INSIDE THE METHODS, we can access the Vue instance with the this keyword. For example, we
    // could call another method:
    saveNote (val) {
      console.log('saving note', val);
      localStorage.setItem('content', val);
      this.reportOperation('saving');
    },
    reportOperation (opName) {
      console.log('The', opName, 'operation was completed!');
    }
  },
})