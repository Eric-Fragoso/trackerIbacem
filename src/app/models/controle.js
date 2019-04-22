const mongoose = require('../../database');
const bcrypt = require('bcryptjs');


const ControleSchema = new mongoose.Schema({
    importadoPor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true,
    },
    publicadoPor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
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