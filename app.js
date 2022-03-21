const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const req = require('express/lib/request');
const res = require('express/lib/response');
const methodOverride = require('method-override')
const app = express();
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const Photo = require('./models/Photo');

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
app.get('/', async (req, res) => {
  const photos = await Photo.find({}); // Birden fazla foto için. find içerisine koşul yazılmadı.
  res.render('index', {
    photos, // anasayfaya dönerken yukarıda tanımladığım photos(fotoların tamamını) render et.
  });
});

app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
            // Tek bir foto için.
    photo, //Sadece yukarıda id'si belirtilen fotoyu getirip render et.
  });
});

app.get('/about.ejs', (req, res) => {
  res.render('about');
});

app.get('/addPhoto.ejs', (req, res) => {
  res.render('addPhoto');
});



app.post('/photos', async (req, res) => {
  // await Photo.create(req.body);       // body bilgisini Photo modeli(db) sayesinde veritabanında dökümana dönüştürüyoruz.
  // res.redirect('/');                //Anasayfama redirect et middlewarimi sonlandır.
  // console.log(req.files.image);    // photo bilgilerinin konsola yazdırabildiğimi kontrol ettim.


  const uploadDir = 'public/uploads'; // fs modülü kullanarak aşağıda bu klasörün olup olmadigini kontrol ediyorum.

  if (!fs.existsSync(uploadDir)) {  // Dosya yok ise oluşturulmasını istedim.
    fs.mkdirSync(uploadDir);       // Sync olarak oluşturmamın sebebi önceden yapmasını istemem.
                                  //  Alttaki işlemlere geçilmeden klasörün varlığını kontrol edip görseli yükletecem.
  }

  let uploadeImage = req.files.image;                                  // Yüklediğim görse (console.log'ta teyit etmiştim.)
  let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name; // Kök dizine çıktıktan sonra public içerisine uploads 
                                                                        // isimli yeni bir klasör oluşturup(aşağıda bunun için fs modülünü kullanacam)
                                                                        // yükleyeceğim dosyanın ismini verecem (klasörün içerisinden dosyamı bulabilmesi için)

    uploadeImage.mv(uploadPath, async () =>{ //https://www.npmjs.com/package/express-fileupload dosya yükleme modülündeki mv() fonks. ile 
    // yakaladığımız uploadImage farklı bir klasöre yönlendirebiliyorum.
    await Photo.create({    // Görseli oluşturma fonks.
      ...req.body, //Spread operatörü ile body ekledim.   
      image: '/uploads/' + uploadeImage.name, // ek olarak  görselin yolunu ekle.
    });
    res.redirect('/');
    // Son olarak photo.ejs içerisinde static olan image yoluna photo.image adresini verip yüklediğimiz görselin template üzerinden görünmesini sağladım.
  });
});  
 

// Edit e gönderme
app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id }); //Hangi fotoyla işlem yapacaksam onu yakaladım.
  res.render('edit', {  //edit sayfasını render ettim.
      photo,
  });
});


// After Edit
app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id }); //Hangi fotoyla işlem yapacaksam onu yakaladım.
  photo.title = req.body.title;       // yeni fotonun bilgileri body'nin içerisinde geliyordu
  photo.description = req.body.description;  // Add ve edit işlemlerinin ikisinde de photonun bodysini kullanıyoruz.
  photo.save(); // Photoyu kaydettim.

  res.redirect(`/photos/${req.params.id}`); // Photonun bulunduğu sayfaya (id ye göre) redirect ettim.

  //res.render('photo' , {photo});
  
});


// Delete photo
app.delete('/photos/:id', async (req, res) => {
  // req ile gelenr resim bulundu
  const photo = await Photo.findById(req.params.id);
  // localde resmin yolu bulundu
  let deletedImage = __dirname + '/public' + photo.image;
  // image localde silindi
  fs.unlinkSync(deletedImage);
  // yapı db den silindi
  await Photo.findByIdAndRemove(req.params.id);
  // anasayfaya yönlendirdi
  res.redirect('/');
});



const port = 3000;
app.listen(port, () => {
  console.log(`Uygulama ${port} nolu portu dinlemektedir.`);
});
