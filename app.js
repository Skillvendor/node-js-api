const express = require('express');
const feedRoutes = require('./routes/feed');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*')
  next();
})

app.use('/feed', feedRoutes)

app.listen(8080)
