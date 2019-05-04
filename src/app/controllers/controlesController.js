const express = require('express');
const authMiddleware = require('../middlewares/auth')
const router = express.Router();
const Controle = require('../models/controle');

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

module.exports = app => app.use('/controles', router);