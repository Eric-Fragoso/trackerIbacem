const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
require('mongoose-double')(mongoose);

const SchemaTypes =mongoose.Schema.Types;



const FinanceiroSchema = new mongoose.Schema({
    fornecedorCod:{
        type: String,
        require:true,
        default:"",
    },
    data:{
        type: Date,
        require:true,
    },
    historico:{
        type: String,
        require:true,
        default:"",
    },
    valor:{
        type: SchemaTypes.Double,
        require: true,
        default:0,
    }


});

FinanceiroSchema.pre('save', async function(next){
    next();    
});

const Financeiro = mongoose.model('Financeiro',FinanceiroSchema);

module.exports = Financeiro;