const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const req = require('express/lib/request');
const res = require('express/lib/response');
const methodOverride = require('method-override')
const app = express();
const ejs = require('ejs');
const photoController = require('./controllers/photoController');
const pageController = require('./controllers/pageController');
//connect DB
mongoose.connect('mongodb://localhost/f1-test-db', {
  useNewUrlParser: true, // Bu iki dönüştürme db nin uygun formatta okunabilmesi için zorunludur.
  useUnifiedTopology: true,
});

// Template Engine
app.set('view engine', 'ejs'); // html uzantısı içerisinde js kodları yazabilmek için bu engine kullandım. (npm içerisinden kullanımına bakabilirim.)

//Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method', {
  methods : ['POST', 'GET']
}));


//Routes
app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos', photoController.createPhoto);  

// After Edit
app.put('/photos/:id', photoController.updatePhoto);

// Delete photo
app.delete('/photos/:id', photoController.deletePhoto);

//get About Page
app.get('/about.ejs', pageController.getAboutPage);

// get AddPhoto Page
app.get('/addPhoto.ejs', pageController.getAddPage);

// Edit e gönderme
app.get('/photos/edit/:id', pageController.getEditPage);




const port = 3000;
app.listen(port, () => {
  console.log(`Uygulama ${port} nolu portu dinlemektedir.`);
});
