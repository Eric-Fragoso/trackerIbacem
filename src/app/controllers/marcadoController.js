const express = require('express');
const authMiddleware = require('../middlewares/auth')
const router = express.Router();
const Mercado = require('../models/mercado');

router.use(authMiddleware);

router.get('/', async(req, res)=>{
    try{
        const mercados = await Mercado.find();

        return res.send({mercados});
    }catch(err){
        return res.status(400).send({error: ' Erro carregando mercados'});
    }
});

router.get('/:mercadoID', async(req, res)=>{
    const fornecedorID = req.params.fornecedorID;

    try{
        const mercados = await Mercado.find({fornecedorCod:fornecedorID}).sort({data: 1})
        return res.send({
            mercados
        });
    }catch(err){
        return res.status(400).send({error:'Mercado não encontrado'});
    }
});


router.post('/', async(req, res)=>{
    try{
        const mercado = await Mercado.create(req.body);
        return res.send({mercado});
    }catch(err){
        return res.status(400).send({error:'Entrada não realizada'});
    }
});

router.put('/:mercadoId', async(req, res)=>{
    const {id, aprovado} = req.body;
    console.log(id);
    try{
        const mercado = await Mercado.findByIdAndUpdate(id, req.body,{new:true});
        console.log(mercado);
        return res.send({
            mercado
        });
    }catch(err){
        return res.status(400).send({error:'Atualização não efetuada'});
    }
});

router.delete('/:mercadoId', async(req, res)=>{
    try{
        await Mercado.findByIdAndRemove(req.params.mercadoId);
        return res.send();
     }catch(err){
         return res.status(400).send({error: 'Erro deletando registro'});
     }
});

module.exports = app => app.use('/mercados', router);