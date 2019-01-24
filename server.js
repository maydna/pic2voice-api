const express = require('express');
const bodyParser=require('body-parser');
const bcrypt=require('bcrypt-nodejs');
const cors=require('cors');
const app = express();
const signup = require('./controllers/signup')
const getprofile = require('./controllers/getprofile')
const imagecount = require('./controllers/imagecount')
const signin = require('./controllers/signin')
const analyzeimage = require('./controllers/analyzeimage')

const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'pic2voiceadamyang',
    database : 'postgres'
  }
});

app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=> {
  return res.json("Hi there, if you see this message it means the backend is not secure, I will improve it soon")
    })


/*
/signin--> post success/fail
/signup--> post return the new user
/profile/:userid --> get return the user
/image --> put --> return the updated user
*/

app.post('/signin',(req,res)=> {signin.handleSignIn(req,res,db,bcrypt)})

app.post('/signup',(req,res)=> {signup.handleSignUp(req,res,db,bcrypt)})

app.get('/profile/:id', (req,res)=> {getprofile.getProfile(req,res,db)})

app.put('/image', (req,res)=> {imagecount.imageCount(req,res,db)})

app.post('/analyzeimage', (req,res)=> {analyzeimage.analyzeImage(req,res)})

app.post('/converttoaudio', (req,res)=> {analyzeimage.convertToAudio(req,res)})

app.listen(3001, () => {
  console.log('app is running on port 3001');
})
