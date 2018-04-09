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
    // alternatively, we can use it with the shorter syntax:
    content:'saveNote',
  },
  methods: {
    saveNote (val) {
      console.log('saving note', val);
      localStorage.setItem('content', val);
    },
  },
})