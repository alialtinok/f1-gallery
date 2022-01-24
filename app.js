const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const path = require('path');
const ejs = require('ejs');

// Template Engine

app.set("view engine", "ejs");

//Middlewares

app.use(express.static('public'));

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



const port = 3000;
app.listen(port, () => {
  console.log(`Uygulama ${port} nolu portu dinlemektedir.`);
});
