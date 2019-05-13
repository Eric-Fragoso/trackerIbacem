const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

var destino=path.resolve(__dirname,'..', 'uploads');

module.exports = {
    dest: destino,
    storage: multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, destino)
        },
        filename:(req, file, cb)=>{
            crypto.randomBytes(6, (err, hash)=>{
                if(err) cb(err);

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
            'application/pdf'
        ];

        if(allowedMimes.includes(file.mimetype)){
            cb(null, true);
        }else{
            cb(new Error('Formato inválido'));
        }
    },
}