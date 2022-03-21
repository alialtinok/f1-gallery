const Photo = require('../models/Photo');

exports.getAboutPage = (req, res) => {
    res.render('about');
  }

  exports.getAddPage =  (req, res) => {
    res.render('addPhoto');
  }

  exports.getEditPage = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id }); //Hangi fotoyla işlem yapacaksam onu yakaladım.
    res.render('edit', {  //edit sayfasını render ettim.
        photo,
    });
  }