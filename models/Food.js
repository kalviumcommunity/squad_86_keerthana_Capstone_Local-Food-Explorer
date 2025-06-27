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

    description:{
        type:String,
        required:true
    },

    image:{
        type:String
    }
});

module.exports = mongoose.model('Food', foodSchema);