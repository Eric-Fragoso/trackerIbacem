const mongoose = require('../../database');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
    nome:{
        type: String,
        require:true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    senha:{
        type:String,
        required:true,
        select:false,
    },
    telefone:{
        tyep:String,
        required:false,
    },
    fidelidade:{
        type:Boolean,
        default:false,
    },
    acesso:{
        type:Number,
        required:true,
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