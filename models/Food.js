const mongoose = require('mongoose');
const foodSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    region:{
        type:String,
        required:true
    },

    description:String,
    image:String,
});

module.exports = mongoose.model('Food', foodSchema);