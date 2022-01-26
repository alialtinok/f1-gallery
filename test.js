const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/f1-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//create schema
const photoSchema = new Schema({
  title: String,
  description: String,
});

const Photo = mongoose.model('Photo', photoSchema);

//create photos

// Photo.create({
//   title: 'Photo Title 3',
//   description: 'Photo Description 3',
// });

// read photos

// Photo.find({}, (err,data) => {
//     console.log(data);
// })

// //Update photos

// const id = '61f16afd078658d614ce2d7e';

// Photo.findByIdAndUpdate(
//     id , {
//         title : `${id} id numaralı fotograf basligi guncellendi`,
//         description : `${id} id numaralı fotograf guncellendi`
//     } ,
//     {
//         new : true
//     } ,
//     (err,data) => {
//      console.log(data)
//  })

delete photo;
const id = '61f16cd080d861da327bc141';
Photo.findByIdAndDelete(id, (err, data) => {
  console.log(`${id} id numaralı veri silinmiştir.`);
});
