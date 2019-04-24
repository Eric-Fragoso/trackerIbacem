const mongoose = require('../../database');
const bcrypt = require('bcryptjs');


const ControleSchema = new mongoose.Schema({
    importadoPor:{
        type: String,
        require:true,
    },
    publicadoPor:{
        type: String,
        require:true,
        default:"",
     },
    codigo:{
        type: String,
        require:true,
    },
    visivel:{
        type:Boolean,
        default:false,
    },
    passoAtual:{
        type:Number,
        required:true,
        default:1,
    },
    importadoEm:{
        type:Date,
        default: Date.now,
    },

});

ControleSchema.pre('save', async function(next){
    next();    
});

const Controle = mongoose.model('Controle',ControleSchema);

module.exports = Controle;