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
    
    let codigo = `${ req.params.controleId}`;
    console.log( req.params.controleId, codigo);
    try{
        const controle = await Controle.find({codigo}).sort({ importadoEm: -1 });

        return res.send({controle});
    }catch(err){
        return res.status(400).send({error: ' Erro carregando controle'});
    }
});

router.get('/controle/:controleId', async(req, res)=>{
    
    let id = `${ req.params.controleId}`;
    console.log( req.params.controleId, id);
    try{
        const controle = await Controle.find({_id:id}).sort({ importadoEm: -1 });
        console.log(controle);
        return res.send({controle});
    }catch(err){
        return res.status(400).send({error: ' Erro carregando controle'});
    }
});

router.get('/fornecedor/:fornecedorID', async(req, res)=>{
    const fornecedorID = req.params.fornecedorID;

    try{
        const controles = await Controle.find({fornecedorCod:fornecedorID})
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

router.post('/gallery', upload.single('file'), async(req, res)=>{

   // let gallery = [];
   // req.files.map((image)=>gallery.push({'url':`http://138.204.68.18:3323/enviadas/${image.filename}`}));

  // let gallery = [];
    const image = await Image.create({
        nome: req.file.filename,
        path: `http://138.204.68.18:3323/enviadas/${req.file.filename}`,
        controleRelacionado: req.body.controle,
        etapaRelacionada: req.body.qualidade
    });

    let controle;

    switch (req.body.qualidade) {
        case "Recepcao":
            console.log("entrou em" + req.body.qualidade);
            controle = await Controle.findByIdAndUpdate(req.body.controle, {qRecepcao:true},{new:true})
        break;
        case "Selecao":
            console.log("entrou em" + req.body.qualidade);
            controle = await Controle.findByIdAndUpdate(req.body.controle, {qSelecao:true},{new:true})   
        break;
        case "Embalamento":
            console.log("entrou em" + req.body.qualidade);
            controle = await Controle.findByIdAndUpdate(req.body.controle, {qEmbalamento:true},{new:true})
        break;
        case "Expedicao":
            console.log("entrou em" + req.body.qualidade);
            controle = await Controle.findByIdAndUpdate(req.body.controle, {qExpedicao:true},{new:true})
        break;
        case "Destino":
            console.log("entrou em" + req.body.qualidade);
            controle = await Controle.findByIdAndUpdate(req.body.controle, {qDestino:true},{new:true})
        break;
    
        default:
            break;
    }


   //console.log(image);
   // req.files.map((image)=>gallery.push(`http://138.204.68.18:3323/enviadas/${image.filename}`));
    res.status(200).json(controle);
});

module.exports = app => app.use('/controles', router);