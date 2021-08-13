const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const MONGO_URI = 'mongodb://localhost/parenting?retryWrites=true';
const MONGO_ONLINE = 'mongodb+srv://palazo:TnSErsEnQ7a6m4T@cluster0.0pe5b.mongodb.net/parenting';

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

mongoose.connect(MONGO_ONLINE, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(result => {
    app.listen(8080);
    console.log('[SERVER RUNNING!]')
  })
  .catch(err => console.log(err))
