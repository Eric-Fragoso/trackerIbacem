const express = require('express');
const authMiddleware = require('../middlewares/auth')
const router = express.Router();
const Controle = require('../models/controle');
const Image = require('../models/images')
const multer = require('multer');
const multerConfig = require('../../config/multer')

const upload = multer(multerConfig);

router.use(authMiddleware);

router.get('/', async(req, res)=>{
    try{
        const controles = await Controle.find().sort({ importadoEm: -1 });

        return res.send({controles});
    }catch(err){
        return res.status(400).send({error: ' Erro carregando controles'});
    }
});

router.get('/:controleId', async(req, res)=>{
    res.send({ Controle: req.controleId});
});

router.get('/fornecedor/:fornecedorID', async(req, res)=>{
    const fornecedorID = req.params.fornecedorID;

    try{
        const controles = await Controle.find({fornecedorCod:fornecedorID,visivel:true})
        console.log(controles, fornecedorID);
        return res.send({
            controles
        });
    }catch(err){
        console.log("Não encontrou");
        return res.status(400).send({error:'Importação não concluida'});
    }
});


router.post('/', async(req, res)=>{
    const {codigo} = req.body;

    try{
        if (await Controle.findOne({codigo}))
            return res.status(400).send({error: 'Controle já importado anteriormente'});
        const controle = await Controle.create(req.body);
        console.log(controle);
        return res.send({
            controle
        });
    }catch(err){
        console.log("Não encontrou");
        return res.status(400).send({error:'Importação não concluida'});
    }
});

router.put('/:controleId', async(req, res)=>{
    const {id, publicadoPor, visivel} = req.body;
    try{
        const controle = await Controle.findByIdAndUpdate(id, req.body,{new:true});
        return res.send({
            controle
        });
    }catch(err){
        return res.status(400).send({error:'Atualização não efetuada'});
    }
});

router.delete('/:controleId', async(req, res)=>{
    try{
        await Controle.findByIdAndRemove(req.params.controleId);
        return res.send();
    }catch(err){
        return res.status(400).send({error: 'Erro deletando o Controle'});
    }
});

router.post('/gallery/:controleId/:etapa', upload.single('file'), async(req, res)=>{

   // let gallery = [];
   // req.files.map((image)=>gallery.push({'url':`http://138.204.68.18:3323/enviadas/${image.filename}`}));

  // let gallery = [];
    const image = await Image.create({
        nome: req.file.filename,
        path: `http://138.204.68.18:3323/enviadas/${req.file.filename}`,
        controleRelacionado: req.params.controleId,
        etapaRelacionada: req.params.etapa
    });

    switch (req.params.etapa) {
        case "Recepcao":
            const controle = await Controle.findByIdAndUpdate(req.params.controleId, {qRecepcao:true},{new:true})
        break;
        case "Selecao":
            const controle = await Controle.findByIdAndUpdate(req.params.controleId, {qSelecao:true},{new:true})   
        break;
        case "Embalamento":
            const controle = await Controle.findByIdAndUpdate(req.params.controleId, {qEmbalamento:true},{new:true})
        break;
        case "Expedicao":
            const controle = await Controle.findByIdAndUpdate(req.params.controleId, {qExpedicao:true},{new:true})
        break;
    
        default:
            break;
    }


   console.log(image);
   // req.files.map((image)=>gallery.push(`http://138.204.68.18:3323/enviadas/${image.filename}`));
    res.status(200).json(image);
});

module.exports = app => app.use('/controles', router);