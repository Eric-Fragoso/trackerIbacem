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
     analisadoPor:{
        type: String,
        require:true,
        default:"",
     },
    codigo:{
        type: String,
        require:true,
    },
    fornecedorCod:{
        type: String,
        require:true,
    },
    visivel:{
        type:Boolean,
        default:false,
    },
    analisado:{
        type:Boolean,
        default:false,
    },
    qRecepcao:{
        type:Boolean,
        default:false,
    },
    qSelecao:{
        type:Boolean,
        default:false,
    },
    qEmbalamento:{
        type:Boolean,
        default:false,
    },
    qExpedicao:{
        type:Boolean,
        default:false,
    },
    passoAtual:{
        type:String,
        require:true,
        default:"",
    },
    importadoEm:{
        type:Date,
        default: Date.now,
    },
    comentario:{
        type:String,
        required:false,
    }
});

ControleSchema.pre('save', async function(next){
    next();    
});

const Controle = mongoose.model('Controle',ControleSchema);

module.exports = Controle;