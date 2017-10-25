const bodyParser = require('body-parser');
const express = require('express');
// const morgan = require('morgan');
const mongoose = require('mongoose');

// const PostPostsRouter = require('./PostPostsRouter');


mongoose.Promise = global.Promise;


const {PORT, DATABASE_URL} = require('./config');
const {Post} = require('./models');

// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
// });

const app = express();
app.use(bodyParser.json());


app.get('/posts', (req, res) => {
  const filters = {};
  const queryableFields = ['title', 'content', 'author'];
  queryableFields.forEach(field => {
      if (req.query[field]) {
          filters[field] = req.query[field];
      }
  });
  Post
    .find(filters)
    .then(posts => res.json(
        posts.map(post => post.apiRepr())
    ))
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});


app.get('/posts/:id', (req, res) => {
  Post
    .findById(req.params.id)
    .then(response =>res.json(response.apiRepr()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});


app.post('/posts', (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Post
    .create({
    
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
    })
    .then(post => res.status(201).json(post.apiRepr()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });

});

app.put('/posts/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['title', 'content', 'author'];
  updateableFields.forEach(field => {
  if (field in req.body) {
    updated[field] = req.body[field];
  }
  });

  Post
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
})

let server;

function runServer() {
  console.log(DATABASE_URL)
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}


if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
