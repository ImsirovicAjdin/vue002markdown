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
    saveNote () {
      console.log('saving note', this.content);
      localStorage.setItem('content', this.content);
      this.reportOperation('saving');
    },
    reportOperation (opName) {
      console.log('The', opName, 'operation was completed!');
    },
  },
  printToConsole:   
    // (1) LOADING the saved note: 
    // Now that we save the note content each time it changes, we will need to restore it when
    // the app is reopened. We will use the localStorage.getItem() API for that:
    console.log('restored note:', localStorage.getItem('content')),
})