const express = require('express');
const authMiddleware = require('../middlewares/auth')
const router = express.Router();
const Financeiro = require('../models/financeiro');

router.use(authMiddleware);

router.get('/', async(req, res)=>{
    try{
        const financeiros = await Financeiro.find();

        return res.send({financeiros});
    }catch(err){
        return res.status(400).send({error: ' Erro carregando Financeiros'});
    }
});

router.get('/:fornecedorID', async(req, res)=>{
    const fornecedorID = req.params.fornecedorID;

    try{
        const financeiros = await Financeiro.find({fornecedorCod:fornecedorID}).sort({data: 1})
        return res.send({
            financeiros
        });
    }catch(err){
        return res.status(400).send({error:'Financeiro não encontrado'});
    }
});


router.post('/', async(req, res)=>{
    try{
        const financeiro = await Financeiro.create(req.body);
        return res.send({financeiro});
    }catch(err){
        return res.status(400).send({error:'Entrada não realizada'});
    }
});

router.put('/:financeiroId', async(req, res)=>{
    const {id, aprovado} = req.body;
    console.log(id);
    try{
        const financeiro = await Financeiro.findByIdAndUpdate(id, req.body,{new:true});
        console.log(financeiro);
        return res.send({
            financeiro
        });
    }catch(err){
        return res.status(400).send({error:'Atualização não efetuada'});
    }
});

router.delete('/:financeiroId', async(req, res)=>{
    try{
        await Financeiro.findByIdAndRemove(req.params.financeiroId);
        return res.send();
     }catch(err){
         return res.status(400).send({error: 'Erro deletando registro'});
     }
});

module.exports = app => app.use('/financeiros', router);