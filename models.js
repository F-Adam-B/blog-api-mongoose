const uuid = require('uuid');
const mongoose = require('mongoose')

// this module provides volatile storage, using a `BlogPost`
// model. We haven't learned about databases yet, so for now
// we're using in-memory storage. This means each time the app stops, our storage
// gets erased.

// don't worry to much about how BlogPost is implemented.
// Our concern in this example is with how the API layer
// is implemented, and getting it to use an existing model.

const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {
    first: {type: String, required: true},
    last: {type: String, required: true}
  },
  content: {type: String, required: true}
});

blogSchema.virtual('authorString').get(function() {
  return `${this.author.first} ${this.author.last}`.trim()});

blogSchema.methods.apiRepr = function() {
  
    return {
      id: this._id,
      title: this.title,
      content: this.content,
      author: this.authorString 
    };
}

const Blog = mongoose.model('Blog', blogSchema);

module.exports = {Blog};

