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
//connect DB  tSRWfkiM4GPVBjbR
mongoose.connect('mongodb+srv://alialtinokDb:5ceBHJ9wCOt0OKeq@cluster0.kd8na.mongodb.net/f1-application?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    console.log('db connected!')
}).catch((err) => {
    console.log(err)
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



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda başlatıldı..`);
});
