const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

var destino=path.resolve(__dirname,'..', 'uploads');
/*var etapa=localStorage.getItem("etapa"); 
var controle = localStorage.getItem("controle"); 
var fornecedorAtual = localStorage.getItem("fornecedorAtual"); 

switch etapa {
    case "RECEPÇÃO":
        destino = path.resolve(__dirname,'..', 'uploads', 'recepcao');
    break;
    case "SELEÇÃO":
        destino = path.resolve(__dirname,'..', 'uploads', 'selecao');
    break;
    case "EMBALAMENTO":
        destino = path.resolve(__dirname,'..', 'uploads', 'embalamento');
    break;
    case "EXPEDIÇÃO":
        destino = path.resolve(__dirname,'..', 'uploads', 'expedicao');
    break;
}*/


module.exports = {
    dest: destino,
    storage: multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, destino)
        },
        filename:(req, file, cb)=>{
            crypto.randomBytes(6, (err, hash)=>{
                if(err) cb(err);

                //const fileName = `${fornecedorAtual}-${controle}-${hash.toString('hex')}-${file.originalname}`;
                const fileName = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, fileName);
            })
        }

    }),
    limits:{
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter:(req,file, cb)=>{
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
            'image/pdf'
        ];

        if(allowedMimes.includes(file.mimetype)){
            cb(null, true);
        }else{
            cb(new Error('Formato inválido'));
        }
    },
}