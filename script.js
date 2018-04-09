
Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'))

// New VueJS instance
new Vue({
  name: 'notebook',

  // CSS selector of the root DOM element
  el: '#notebook',

  // Some data
  data () {
    return {
      // These are loaded from localStorage and have a default value
      // Don't forget the JSON parsing for the notes array
      notes: JSON.parse(localStorage.getItem('notes')) || [],
      selectedId: localStorage.getItem('selected-id') || null,
    }
  },

  // Computed properties
  computed: {
    selectedNote () {
      // We return the matching note with selectedId
      return this.notes.find(note => note.id === this.selectedId)
    },

    notePreview () {
      // Markdown rendered to HTML
      return this.selectedNote ? marked(this.selectedNote.content) : ''
    },

    sortedNotes () {
      return this.notes.slice().sort((a, b) => a.created - b.created)
      .sort((a, b) => (a.favorite === b.favorite)? 0 : a.favorite? -1 : 1)
    },

    linesCount () {
      if (this.selectedNote) {
        // Count the number of new line characters
        return this.selectedNote.content.split(/\r\n|\r|\n/).length
      }
    },

    wordsCount () {
      if (this.selectedNote) {
        var s = this.selectedNote.content
        // Turn new line cahracters into white-spaces
        s = s.replace(/\n/g, ' ')
        // Exclude start and end white-spaces
        s = s.replace(/(^\s*)|(\s*$)/gi, '')
        // Turn 2 or more duplicate white-spaces into 1
        s = s.replace(/[ ]{2,}/gi, ' ')
        // Return the number of spaces
        return s.split(' ').length
      }
    },

    charactersCount () {
      if (this.selectedNote) {
        return this.selectedNote.content.split('').length
      }
    },
  },

  // Change watchers
  watch: {
    // When our notes change, we save them
    notes: {
      // The method name
      handler: 'saveNotes',
      // We need this to watch each note's properties inside the array
      deep: true,
    },
    // Let's save the selection too
    selectedId (val, oldVal) {
      localStorage.setItem('selected-id', val)
    },
  },

  methods:{
    // Add a note with some default content and select it
    addNote () {
      const time = Date.now()
      // Default new note
      const note = {
        id: String(time),
        title: 'New note ' + (this.notes.length + 1),
        content: '**Hi!** This notebook is using [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting!',
        created: time,
        favorite: false,
      }
      // Add
      this.notes.push(note)
      // Select
      this.selectNote(note)
    },

    // Remove the selected note and select the next one
    removeNote () {
      if (this.selectedNote && confirm('Delete the note?')) {
        // Remove the note in the notes array
        const index = this.notes.indexOf(this.selectedNote)
        if (index !== -1) {
          this.notes.splice(index, 1)
        }
      }
    },

    selectNote (note) {
      // This will update the 'selectedNote' computed property
      this.selectedId = note.id
    },

    saveNotes () {
      // Don't forget to stringify to JSON before storing
      localStorage.setItem('notes', JSON.stringify(this.notes))
      console.log('Notes saved!', new Date())
    },

    favoriteNote () {
      // this.selectedNote.favorite = !this.selectedNote.favorite
      // this.selectedNote.favorite = this.selectedNote.favorite ^ true
      this.selectedNote.favorite ^= true
    },
  },
})

/*
Notes:

DYNAMIC CSS CLASSES
-------------------
Goal: Add a SELECTED CSS class when a note is selected
Solution: 
Vue's v-bind directive has some magic to make the manipulation of CSS classes easier.
Instead of passing a string, you can pass an array of strings:
<div :class="['one', 'two', 'three']">
We'll get the following in the DOM:
<div class="one two three">
However, the most interesting feature si you can pass an OBJECT whose KEYS are CLASS NAMES and
whose values are Booleans that determine whether or not each class should be applied:
<div :class="{one:true, two: false, three:true}">
The above object notation will produce the following HTML:
<div class="one three">
In our case, we want to apply the selected class only if the note is the selected one. So, we 
will simply write as follows:
<div :class="{ selected: note === selectedNote }">
The note list should now look like this:
<div class="notes">
  <div class="note" v-for="not of notes" @click="selectNote(note)" 
  :class="{selected: note === selectedNote}">{{note.title}}</div>
</div>
Note: You can COMBINE a static class attribute with a dynamic one. It is recommended that
you put the nondynamic classes into the static attribute because Vue will optimize the static
values.

CONDITIONAL TEMPLATES WITH v-if
-------------------------------
The main and preview panes shouldn't be displayed if no notes is selected--it would not make sense 
for the user to have an empty editor and preview pane pointing to nothing, and it would make our
code crash since selectedNote would be NULL. The v-if directive can dynamically take
parts out of the template when we want.
It works just like the JavaScript if keyword, with a condition. For example,
the following div element will not be in the DOM at all while the loading property is falsy:
<div v-if="loading">
  Loading...
</div>
There are also v-else and v-else-if directives:
<div v-if="loading">
  Loading...
</div>
<div v-else-if="processing">
  Processing
</div>
<div v-else>
  Content here
</div>

In our app we add the v-if="selectedNote" condition to the panes so that they are not added to
the DOM until a note is selected:
<!-- Main pane -->
<section class="main" v-if="selectedNote">
...
</section>
<!-- Preview pane -->
<aside class="preview" v-if="selectedNote" v-html="notePreview">
</aside>

To avoid the above repetition, you can surround both elements with a special <template>
tag that acts like braces in JavaScript:
<template v-if="selectedNote">
  <!-- Main pane -->
  <section class="main">
  ...
  </section>
  <!-- Preview pane -->
  <aside class="preview" v-html="notePreview">
  </aside>
</template>
NOTE: The <template> tag will not be present in the DOM; it is more like a ghost element
that is useful to regroup real elements together.

SAVING THE NOTES WITH THE DEEP OPTION
-------------------------------------
To save and restore the notes between sessions, just like we did for the note content,
we'll create a new SAVENOTES method. 
Since we can't save an array of objects directly into the localStorage API (it only accepts
strings), we need to convert it to JSON first with JSON.stringify:
methods: {
  ...
  saveNotes() {
    // Don't forget to stringify to JSON before storing
    localStorage.setItem('notes', JSON.stringify(this.notes))
  }
}
---
Like we did for the previous content property, we'll watch the notes dataproperty for  changes
to trigger the saveNotes method. Add a watcher in the watch option:
watch: {
  notes: 'saveNotes',
}
---
Change the initialization of the NOTES property in the DATA hook to load the stored list
from localStorage:
data () {
  return {
    notes: JSON.parse(localStorage.getItem('notes')) || [],
    selectedId: null,
  }
},
The newly added notes should be restored when you refresh the page. However, if you try to change the content of one note, you will notice that it doesn't trigger the notes watcher, and thus, the notes are not saved. This is because, by default, the watchers are only watching the direct changes to the target object--assignment of a simple value, adding, removing, or moving an item in an array. For example, the following operations will be detected by default:

Copy
// Assignment
this.selectedId = 'abcd'

// Adding or removing an item in an array
this.notes.push({...})
this.notes.splice(index, 1)

// Sorting an array
this.notes.sort(...)
However, all the other operations, like these, will not trigger the watcher:

Copy
// Assignment to an attribute or a nested object
this.myObject.someAttribute = 'abcd'
this.myObject.nestedObject.otherAttribute = 42

// Changes made to items in an array
this.notes[0].content = 'new content'
In this case, you will need to add the deep option to the watcher:

Copy
watch: {
  notes: {
    // The method name
    handler: 'saveNotes',
    // We need this to watch each note's properties inside the array
    deep: true,
  },
}
That way, Vue will also watch the objects and attributes recursively inside our 
notes array. Now, if you type into the text editor, the notes list should be
saved--the v-model directive will modify the content property of the selected note, 
and with the deep option, the watcher will be triggered.

Saving the selection
It would be very handy if our app could select the note that was selected last time. We just need to store and load the selectedId data property used to store the ID of the selected note. That's right! Once more, we will use a watcher to trigger the save:

Copy
watch: {
  ...

  // Let's save the selection too
  selectedId (val) {
    localStorage.setItem('selected-id', val)
  },
}
Also, we will restore the value when the property is initialized:

Copy
data () {
  return {
    notes: JSON.parse(localStorage.getItem('notes')) || [],
    selectedId: localStorage.getItem('selected-id') || null,
  }
},
It's ready! Now, when you refresh the app, it should look exactly how you left it,
with the same note selected.

The note toolbar with extras inside
Some features are still missing from our app, such as deleting or renaming the selected note. We will add these in a new toolbar, just above the note text editor. Go ahead and create a new div element with the toolbar class ;inside the main section:

Copy
<!-- Main pane -->
<section class="main">
  <div class="toolbar">
    <!-- Our toolbar is here! -->
  </div>
  <textarea v-model="selectedNote.content"></textarea>
</div>
We will add three new features in this toolbar:

Renaming the note
Deleting the note
Marking the note as favorite
Renaming the note
This first toolbar feature is also the easiest. It only consists of a text input bound to the title property of the selected note with the v-model directive.

In the toolbar div element we just created, add this input element with the v-model directive and a placeholder to inform the user of its function:

Copy
<input v-model="selectedNote.title" placeholder="Note title" />
You should have a functional rename field above the text editor and see the note name change automatically in the note list as you type

Note
Since we set the deep option on the notes watcher, the note list will be saved whenever you change the name of the selected note.

Deleting the note
This second feature is a bit more complicated because we need a new method:

Add a button element after the rename text input:
Copy
      <button @click="removeNote" title="Remove note"><i        
      class="material-icons">delete</i></button>
As you can see, we listen to the click event with the v-onshorthand (the @ character) that calls the removeNote method that we will create very soon. Also, we put an appropriate icon as the button content.

Add a new removeNote method that asks the user for confirmation and then removes the currently selected note from the notes array using the splice standard array method:
Copy
      removeNote () {
        if (this.selectedNote && confirm('Delete the note?')) {
          // Remove the note in the notes array
          const index = this.notes.indexOf(this.selectedNote)
          if (index !== -1) {
            this.notes.splice(index, 1)
          }
        }
      }
Now, if you try deleting the current note, you should note that the following three things happen:

The note is removed from the note list on the left
The text editor and the preview pane are hidden
The note list has been saved according to the browser console
Favorite notes
The last toolbar feature is the most complex. We want to reorder the note list with the favorite notes first. To do that, each note has a favorite Boolean property that will be toggled with a button. In addition to that, a star icon will be displayed in the note list to make it obvious which notes are favorite and which ones are not:

Start by adding another button to the toolbar before the Remove note ;button:
Copy
      <button @click="favoriteNote" title="Favorite note"><i        
      class="material-icons">{{ selectedNote.favorite ? 'star' :               
      'star_border' }}</i></button>
Once again, we use the v-onshorthand to call the favoriteNote method we will create next. We will also display an icon, depending on the value of the favorite property of the selected note--a full star if it is true, or an outlined one if it is not.

The final result will look like this:


On the left, there is a button for when the note is not favorite, and on the right, for when it is, after clicking on it.

Let's create a very simple favoriteNote method that only invert the value of the favorite ;Boolean property on the selected note:
Copy
      favoriteNote () {
        this.selectedNote.favorite = !this.selectedNote.favorite
      },
We can rewrite this with the XOR operator:

Copy
favoriteNote () {
  this.selectedNote.favorite = this.selectedNote.favorite ^ true
},
This can be nicely shortened, as follows:

Copy
favoriteNote () {
  this.selectedNote.favorite ^= true
},
Now, you should be able to toggle the favorite button, but it doesn't have any real effect yet.

We need to sort the note list in two ways--first, we sort all the notes by their creation date, then we sort them so that the favorite ones are put at the start. Thankfully, we have a very convenient standard array method for that--sort. It takes one argument, which is a function with two parameters--two items to be compared. The result is a number, as follows:

0, if the two items are in an equivalent position
-1, if the first item should be before the second one
1, if the first item should be after the second one
Note
You are not limited to the 1 number, since you can return any arbitrary number, positive or negative. For example, if you return -42, it will be the same as -1.

The first sorting operation will be achieved with this simple subtracting code:

Copy
sort((a, b) => a.created - b.created)
Here, we compare two notes on their creation date that we stored as a number of milliseconds, thanks to Date.now(). We just subtract them so that we get a negative number if b was created after a, or a positive number if a was created after b.

The second sort is done with two ternary operations:

Copy
sort((a, b) => (a.favorite === b.favorite)? 0 : a.favorite? -1 : 1)
If both notes are favorite, we don't change their position. If a is favorite, we return a negative number to put it before b. In the other case, we return a positive number, so b is put before a in the list.

The best way is to create a computed property called sortedNotes, which will get updated and cached automatically by Vue.

Create the new sortedNotes computed property:
Copy
      computed: {
        ...
 
        sortedNotes () {
          return this.notes.slice()
            .sort((a, b) => a.created - b.created)
            .sort((a, b) => (a.favorite === b.favorite)? 0
              : a.favorite? -1    
              : 1)
        },
      }
Note
Since sort modifies the source array directly, we should create a copy of it with the slice method. This will prevent unwanted triggers of the notes watcher.

Now, we can simply swap notes with sortedNotes in the v-for directive used to display the list--it will now sort the notes automatically as we expected:

Copy
<div v-for="note of sortedNotes">
We can also use the v-if directive we introduced earlier to display a star icon only if the note is favorite:

Copy
<i class="icon material-icons" v-if="note.favorite">star</i>
Modify the note list with the preceding changes:
Copy
      <div class="notes">
        <div class="note" v-for="note of sortedNotes"
        :class="{selected: note === selectedNote}"
        @click="selectNote(note)">
          <i class="icon material-icons" v-if="note.favorite">
          star</i> 
          {{note.title}}
        </div>
      </div>

The status bar
The last section we will add to our app is a status bar, displayed at the bottom of the text editor, with some useful info--the date the note was created, with the lines, words, and characters count.

Create a new div element with the toolbar and status-bar classes and place it after the textarea element:

Copy
<!-- Main pane -->
<section class="main">
  <div class="toolbar">
    <!-- ... -->
  </div>
  <textarea v-model="selectedNote.content"></textarea>
  <div class="toolbar status-bar">
    <!-- The new status bar here! -->
  </div>
</section>
Created date with a filter
We will now display the creation date of the selected note in the status bar.

In the status bar div element, create a new span element as follows:
Copy
      <span class="date">
        <span class="label">Created</span>
        <span class="value">{{ selectedNote.created }}</span>
      </span>
Now, if you look at the result displayed in your browser, you should see the number of milliseconds representing the date the note was created

This is not user-friendly at all!

We need a new library to help us format the date into a more readable result--momentjs, which is a very popular time and date manipulation library.

Include it in the page like we did for the marked library:
Copy
      <script src="https://unpkg.com/moment"></script>
To format a date, we will first create a moment object, and then we will use the format method like in the following:

Copy
      moment(time).format('DD/MM/YY, HH:mm')
Now is the time to introduce one last feature of Vue for this chapter--the filters. These are functions that are used inside templates to easily process data before it is displayed or passed to an attribute. For example, we could have an uppercase filter to transform a string into uppercase letters or a currency filter to convert currencies on the fly in a template. The function takes one argument--the value to be processed by the filter. It returns the processed value.

So, we will create a new date filter that will take a date time and will format it to a human-readable format.

Register this filter with the Vue.filter global method (outside of the Vue instance creation code, for example, at the beginning of the file):
Copy
      Vue.filter('date', time => moment(time)
        .format('DD/MM/YY, HH:mm'))
Now, we can use this date filter in our template to display dates. The syntax is the JavaScript expression like we used before, followed by a pipe operator and the name of the filter:

Copy
{{ someDate | date }}
If someDate contains a date, it will output something like this in the DOM, respecting the DD/MM/YY, HH:mm format we defined before:

Copy
12/02/17, 12:42
Change the stat template into this:
Copy
      <span class="date">
        <span class="label">Created</span>
        <span class="value">{{ selectedNote.created | date }}</span>
      </span>
We should have the date nicely formatted and displayed in our app:

Text stats
The last statswe can display are more "writer-oriented"--the lines, words, and characters count:

Let's create three new computed properties for each counter, with some Regular Expressions to get the job done:
Copy
      computed: {
        linesCount () {
          if (this.selectedNote) {
            // Count the number of new line characters
            return this.selectedNote.content.split(/\r\n|\r|\n/).length
          }
        },

        wordsCount () {
          if (this.selectedNote) {
            var s = this.selectedNote.content
            // Turn new line cahracters into white-spaces
            s = s.replace(/\n/g, ' ')
            // Exclude start and end white-spaces
            s = s.replace(/(^\s*)|(\s*$)/gi, '')
            // Turn 2 or more duplicate white-spaces into 1
            s = s.replace(/\s\s+/gi, ' ')
            // Return the number of spaces
            return s.split(' ').length
          }
        },

        charactersCount () {
          if (this.selectedNote) {
            return this.selectedNote.content.split('').length
          }
        },
      }
Note
Here, we added some conditions to prevent the code from running if no note is currently selected. This will avoid crashes if you use the Vue devtools to inspect the app in this case, because it will try to compute all the properties.

You can now add three new stat span elements with the corresponding computed properties:
Copy
      <span class="lines">
        <span class="label">Lines</span>
        <span class="value">{{ linesCount }}</span>
      </span>
      <span class="words">
        <span class="label">Words</span>
        <span class="value">{{ wordsCount }}</span>
      </span>
      <span class="characters">
        <span class="label">Characters</span>
        <span class="value">{{ charactersCount }}</span>
      </span>

Summary
In this chapter, we created our first real Vue app, with several useful functions, like a real-time markdown preview, a note list, and the local persistence of the notes. We introduced different Vue features, such as the computed properties that are automatically updated and cached as needed, the methods to reuse logic inside functions, the watchers to trigger code when properties change, lifecycle hooks to execute code when the Vue instance is created, and the filters to easily process expressions in our template. We also used a lot of Vue directives inside our template, such as ;v-model to bind form inputs, v-html to display dynamic HTML from our JavaScript properties, v-for to repeat elements and display lists, v-on (or @) to listen to events, v-bind (or :) to dynamically bind HTML attributes to JavaScript expressions or to apply CSS classes dynamically, and v-if to include or not template parts, depending on JavaScript expressions. We saw all of these features come together to build a fully functional web application, with Vue superpower helping us to get the work done without getting in the way.

In the next chapter, we will start a new project--a card-based browser game. We will introduce some new Vue features and will keep reusing all we know to continue building better and prettier web apps.


*/
