new Vue({
  el: '#notebook',
  data () {
    return {
      content: localStorage.getItem('content') || 'You can write in **markdown**',
      notes: [],
      // Selectin a note: When a note is selected, it becomes the context of the middle
      // and right panes of the app -- the text editor modifies its content, and the 
      // preview pane displays its formatted markdown. Let's implement this behavior:
      // (1) Id of the selected note:
      selectedId: null,
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
    // Add a note with some default contend and select it
    addNote () {
      const time = Date.now();
      // Default new note
      const note = {
        id: String(time),
        title: 'New note ' + (this.notes.length + 1),
        content: '**Hi!** This notebook is using [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting!',
        created: time,
        favorite: false,
      }
      // Add to the list
      this.notes.push(note)
    },
    // (2) We need a new method that will be called when we click on a note in the list to 
    // select ID. Let's call it selectNote:
    selectNote (note) {
      this.selectedId = note.id
    },
  },
})