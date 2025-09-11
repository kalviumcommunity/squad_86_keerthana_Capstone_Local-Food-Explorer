const mongoose = require('mongoose');
const foodSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    region:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required:true
    },

    description:String,
    image:String,
});

module.exports = mongoose.model('Food', foodSchema);