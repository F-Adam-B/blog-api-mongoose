const uuid = require('uuid');
const mongoose = require('mongoose')

// this module provides volatile storage, using a `Post`
// model. We haven't learned about databases yet, so for now
// we're using in-memory storage. This means each time the app stops, our storage
// gets erased.

// don't worry to much about how PostPost is implemented.
// Our concern in this example is with how the API layer
// is implemented, and getting it to use an existing model.

const PostSchema = mongoose.Schema({
  title: {type: String, required: true},
  
  author: {
    firstName: String,
    lastName:  String
  },
  content: {type: String, required: true},
  created: {type: Date, default: Date.now}
});

PostSchema.virtual('authorString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()});

PostSchema.methods.apiRepr = function() {
  
    return {
      id: this._id,
      title: this.title,
      content: this.content,
      author: this.authorString 
    };
}

const Post = mongoose.model('Post', PostSchema);

module.exports = {Post};

