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
    content (val, oldVal) {
      console.log('new note:', val, 'old note:', oldVal);
      localStorage.setItem('content', val);
    },
  },
})