const express = require('express');
const authMiddleware = require('../middlewares/auth')
const router = express.Router();
const Controle = require('../models/controle');

router.use(authMiddleware);

router.get('/', async(req, res)=>{
    try{
        const controles = await Controle.find().populate('User');

        return res.send({controles});
    }catch(err){
        return res.status(400).send({error: ' Erro carregando controles'});
    }
});

router.get('/:controleId', async(req, res)=>{
    res.send({ Controle: req.controleId});
});

router.post('/', async(req, res)=>{
    const {objeto} = req.body;
    console.log(req.body);
    console.log({objeto});
    console.log({objeto}.codigo);
    try{
        if (await Controle.findOne(objeto.codigo))
            return res.status(400).send({error: 'Controle já importado anteriormente'});
        const controle = await Controle.create(req.body);
        
        return res.send({
            controle
        });
    }catch(err){
        return res.status(400).send({error:'Importação não concluida'});
    }
});

router.put('/:controleId', async(req, res)=>{
    res.send({Controle: req.controleId});
});

router.delete('/:controleId', async(req, res)=>{
    res.send({Controle: req.controleId});
});

module.exports = app => app.use('/controles', router);