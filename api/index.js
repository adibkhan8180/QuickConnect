const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 4000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');

mongoose
  .connect('mongodb+srv://adibkhan8180:Adib%408180@cluster0.rkgtbq9.mongodb.net/')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.log('Error connecting to MongoDB', error);
  });

app.listen(port, () => {
  console.log('Server is running on port 4000');
});

const User = require('./models/user');
const Message = require('./models/message');
