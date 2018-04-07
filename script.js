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
  // (1) To save changes in our app, we'll set up watchers so that when
  // the data changes, this gets saved to localStrorage.
  // the WATCH OPTION is a DICTIONARY, with KEYS being THE NAME OF THE WATCHED PROPERTIES and
  // the VALUE being A WATCHING OPTION OBJECT. The WATCHING OPTION OBJECT must have a HANDLER
  // property, which is either a FUNCTION or THE NAME OF A METHOD. The HANDLER will recieve 
  // 2 ARGUMENTS - the NEW VALUE and the OLD VALUE of the PROPERTY BEING WATCHED.
  watch: {
    // Watching 'content' data property 
    content: {
      handler (val, oldVal) {
        console.log('new note:', val, 'old note:', oldVal);
      },
      // (2) There are 2 options you can use alongside handler: 
      // - deep (a Boolean that tells Vue to watch for changes recursively inside nested objects)
      // - immediate (a Boolean that forces the handler to be called immediately instead of waiting 
      // for the first change)
      immediate: true,
      // As soon as you refresh the app, you should see the following message pop up in the
      // browser console: 'new note: This is a **note** old note: undefined
      // the old note was undefined because the watcher handler was called when the 
      // instance was created - we don't really need this option here, so in the next commit we'll 
      // delete it
    },
  },
})