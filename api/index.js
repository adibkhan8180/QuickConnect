const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');

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
  console.log(`Server is running on port ${port}`);
});

const User = require('./models/user');
const Message = require('./models/message');

app.post('/register', async (req, res) => {
  const {name, email, password, image} = req.body;

  const newUser = new User({name, email, password, image});

  newUser
    .save()
    .then(() => {
      res.status(200).json({message: 'User registered succesfully!'});
    })
    .catch(error => {
      console.log('Error creating a user');
      res.status(500).json({message: 'Error registering the user'});
    });
});

app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({message: 'Invalid email'});
    }

    if (user.password !== password) {
      return res.status(401).json({message: 'Invalid password'});
    }

    const secretKey = crypto.randomBytes(32).toString('hex');

    const token = jwt.sign({userId: user._id}, secretKey);

    res.status(200).json({token});
  } catch (error) {
    console.log('error loggin in', error);
    res.status(500).json({message: 'Error loggin In'});
  }
});

app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({_id: {$ne: userId}});

    res.json(users);
  } catch (error) {
    console.log('Error', error);
  }
});

app.post('/sendrequest', async (req, res) => {
  const {senderId, receiverId, message} = req.body;

  console.log(senderId);
  console.log(receiverId);
  console.log(message);

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({message: 'Receiver not found'});
  }

  receiver.requests.push({from: senderId, message});
  await receiver.save();

  res.status(200).json({message: 'Request sent succesfully'});
});