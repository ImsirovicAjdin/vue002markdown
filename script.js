// (4)
// The Vue constructor is called with the NEW keyword to create a new instance of the Vue object.
// It has one arg, the OPTCIONS OBJECT; it can have multiple attributes (called options)
new Vue({
  // (5)
  // The EL OPTION tells Vue where to add (or 
  // "mount") the instance on our web page using a CSS selector
  el: '#notebook',
  // (6)
  // Next, we'll add the DATA OPTION that will hold the CONTENT of our note
  data () {
    return {
      content: 'This is a note. You can type in here.',
    }
  },
})