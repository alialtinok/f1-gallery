const express = require('express');
const mongoose = require('mongoose');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const path = require('path');
const ejs = require('ejs');
const Photo = require('./models/Photo');



//connect DB
mongoose.connect('mongodb://localhost/f1-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Template Engine
app.set("view engine", "ejs");

//Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//Routes
app.get('/', async(req, res) => {
  const photos =await Photo.find({})
  res.render('index' , {
    photos
  })
   
// photos routes
});

app.get('/about.ejs', (req, res) => {
  res.render('about');
});

app.get('/addPhoto.ejs', (req, res) => {
  res.render('addPhoto');
});

app.post('/photos', async (req, res) => { 
await Photo.create(req.body) // body bilgisini Photo modeli sayesinde veritabanında dökümana dönüştürüyoruz.
  res.redirect('/')
});

const port = 3000;
app.listen(port, () => {
console.log(`Uygulama ${port} nolu portu dinlemektedir.`);
});
