const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const MONGO_URI = 'mongodb://localhost/parenting?retryWrites=true';

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
})

app.use(authRoutes);
app.use(postRoutes);

mongoose.connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(result => {
    app.listen(8080);
    console.log('[SERVER RUNNING!]')
  })
  .catch(err => console.log(err))
