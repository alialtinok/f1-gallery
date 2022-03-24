const Photo = require('../models/Photo')
const fs = require('fs')

exports.getAllPhotos = async (req, res) => {

  const page = req.query.page || 1; // req.query.page ile gelen sayfa bilgisi varsa onu alıyoruz.
  const limit = 3; // 3 tane foto gösterilecek.
  const totalPhotos = await Photo.countDocuments(); // db'deki toplam foto sayısını buluyoruz.
  const photos = await Photo.find().skip((page - 1) * limit).limit(limit); //skip ile ilk 3 foto getir.
  res.render('index', {
    photos,
    current: page,
    pages: Math.ceil(totalPhotos / limit),
  });




  // const photos = await Photo.find({}); // Birden fazla foto için. find içerisine koşul yazılmadı.
  // res.render('index', {
  //   photos, // anasayfaya dönerken yukarıda tanımladığım photos(fotoların tamamını) render et.
  // });
};


exports.getPhoto = async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    res.render('photo', {
              // Tek bir foto için.
      photo, //Sadece yukarıda id'si belirtilen fotoyu getirip render et.
    });
  }

  exports.createPhoto = async (req, res) => {
    // await Photo.create(req.body);       // body bilgisini Photo modeli(db) sayesinde veritabanında dökümana dönüştürüyoruz.
    // res.redirect('/');                //Anasayfama redirect et middlewarimi sonlandır.
    // console.log(req.files.image);    // photo bilgilerinin konsola yazdırabildiğimi kontrol ettim.
  
  
    const uploadDir = 'public/uploads'; // fs modülü kullanarak aşağıda bu klasörün olup olmadigini kontrol ediyorum.
  
    if (!fs.existsSync(uploadDir)) {  // Dosya yok ise oluşturulmasını istedim.
      fs.mkdirSync(uploadDir);       // Sync olarak oluşturmamın sebebi önceden yapmasını istemem.
                                    //  Alttaki işlemlere geçilmeden klasörün varlığını kontrol edip görseli yükletecem.
    }
  
    let uploadeImage = req.files.image;                                  // Yüklediğim görse (console.log'ta teyit etmiştim.)
    let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name; // Kök dizine çıktıktan sonra public içerisine uploads 
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
  }


  exports.updatePhoto = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id }); //Hangi fotoyla işlem yapacaksam onu yakaladım.
    photo.title = req.body.title;       // yeni fotonun bilgileri body'nin içerisinde geliyordu
    photo.description = req.body.description;  // Add ve edit işlemlerinin ikisinde de photonun bodysini kullanıyoruz.
    photo.save(); // Photoyu kaydettim.
  
    res.redirect(`/photos/${req.params.id}`); // Photonun bulunduğu sayfaya (id ye göre) redirect ettim.
  
    //res.render('photo' , {photo});
    
  }


  exports.deletePhoto = async (req, res) => {
    // req ile gelenr resim bulundu
    const photo = await Photo.findById(req.params.id);
    // localde resmin yolu bulundu
    let deletedImage = __dirname + '/../public' + photo.image;
    // image localde silindi
    fs.unlinkSync(deletedImage);
    // yapı db den silindi
    await Photo.findByIdAndRemove(req.params.id);
    // anasayfaya yönlendirdi
    res.redirect('/');
  }
