const mongoose = require('../../database');

const ImageSchema = new mongoose.Schema({
    nome:{
        type: String,
        required:true,
    },
    path:{
        type: String,
        unique: true,
        required: true
    },
    controleRelacionado:{
        type: String,
        required: true
    },
    etapaRelacionada:{
        type:String,
        required:true
    },
    criadoEm:{
        type:Date,
        default: Date.now,
    },

});

const Image = mongoose.model('Image',ImageSchema);

module.exports = Image;