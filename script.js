new Vue({
  el: '#notebook',
  data () {
    return {
      content: 'This is a note. You can type in here.',
    }
  },
  computed: {
    notePreview () {
      // Markdown rendered to HTML 
      return marked(this.content);
    },
  },
  watch: {
    // Watching 'content' data property 
    // shorter syntax can skip the handler option:
    content (val, oldVal) {
      console.log('new note:', val, 'old note:', oldVal)
    },
  },
})