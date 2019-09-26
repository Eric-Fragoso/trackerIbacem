const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const MercadoSchema = Schema({
    mercadoCod:{
        type: String,
        require:true,
        default:"",
    },
    data:{
        type: Date,
        require:true,
    },
    resenha:{
        type: String,
        require:true,
        default:"",
    },
    aprovado:{
        type: Boolean,
        require: true,
        default: false,
    }
});

MercadoSchema.pre('save', async function(next){
    next();    
});

const Mercado = mongoose.model('Mercado',MercadoSchema);

module.exports = Mercado;