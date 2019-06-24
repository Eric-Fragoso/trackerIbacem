const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const FinanceiroSchema = Schema({
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
        type: Currency,
        require: true,
    },
    aprovado:{
        type: Boolean,
        require: true,
        default: false,
    }
    nf:{
        type: String,
        require:false,
        default:"",
    },


});

FinanceiroSchema.pre('save', async function(next){
    next();    
});

const Financeiro = mongoose.model('Financeiro',FinanceiroSchema);

module.exports = Financeiro;