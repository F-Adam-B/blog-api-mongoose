const bodyParser = require('body-parser');
const express = require('express');
// const morgan = require('morgan');
const mongoose = require('mongoose');

// const blogPostsRouter = require('./blogPostsRouter');


mongoose.Promise = global.Promise;


const {PORT, DATABASE_URL} = require('./config');
const {Blog} = require('./models');

// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
// });

const app = express();
app.use(bodyParser.json());


// app.use(morgan('common'));
// app.use('/blog-posts', blogPostsRouter);



let server;

function runServer() {
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
