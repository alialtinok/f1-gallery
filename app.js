const express = require('express');
const mongoose = require('mongoose');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const path = require('path');
const ejs = require('ejs');
const Photo = require('./models/Photo')

// Template Engine

app.set("view engine", "ejs");


//connect DB
mongoose.connect('mongodb://localhost/f1-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


//Middlewares

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
//Routes

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about.ejs', (req, res) => {
  res.render('about');
});

app.get('/addPhoto.ejs', (req, res) => {
  res.render('addPhoto');
});

app.post('/photos123', (req, res) => {
  console.log(req.body);
  res.redirect('/')
});


const port = 3000;
app.listen(port, () => {
  console.log(`Uygulama ${port} nolu portu dinlemektedir.`);
});
