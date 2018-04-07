new Vue({
  el: '#notebook',
  data () {
    return {
      content: 'This is a note. You can type in here.',
    }
  },
  // (1)
  // A very powerful feature of Vue is the COMPUTED PROPERTY.
  // It allows us to DEFINE NEW PROPERTIES that COMBINE any # of properties and use TRANSFORMATIONS,
  // such as converting a markdown string into HTML - that's why IT'S VALUE IS DEFINED by a function.
  // A computed property has the following features:
  // - The VALUE IS CACHED
  // - It is auto-updated as needed WHEN A PROPERTY USED INSIDE THE FUNCTION HAS CHANGED
  // - It will help us automatically convert the note markdown into valid HTML, so we can display a preview in real time.
  // - The computed property is DECLARED IN THE COMPUTED OPTION:
  computed: {
    notePreview () {
      // Markdown rendered to HTML 
      return marked(this.content);
    },
  },
})