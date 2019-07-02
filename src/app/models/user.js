const mongoose = require('../../database');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
    nome:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    fornecedorRelacionado:{
        type: Number,
    },
    senha:{
        type:String,
        required:true,
        select:false,
    },
    telefone:{
        type:String,
        required:false,
    },
    fidelidade:{
        type:Boolean,
        default:false,
    },
    acesso:{
        type:String,
        required:true,
    },
    acessoAnalista:{
        type:String,
        required:false,
    },
    ativo:{
        type:Boolean,
        default:true,
    },
    passResetToken:{
        type:String,
        select:false,
    },
    passResetExpires:{
        type:Date,
        select:false,
    },
    criadoEm:{
        type:Date,
        default: Date.now,
    },

});

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.senha,10);
    this.senha =hash;

    next();    
});

const User = mongoose.model('User',UserSchema);

module.exports = User;