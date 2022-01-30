const mongoose = require('mongoose');
const Schema = mongoose.Schema;




//create schema
const photoSchema = new Schema({
    title: String,
    description: String,
    image : String,
    dateCreated : {
        type:Date,
        default: Date.now
    }
  });
  

  const Photo = mongoose.model('Photo', photoSchema);

  module.exports = Photo