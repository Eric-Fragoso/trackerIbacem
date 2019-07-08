const express = require('express');
const authMiddleware = require('../middlewares/auth')
const router = express.Router();
const Image = require('../models/images');

router.use(authMiddleware);

router.get('/', async (req, res)=>{
    try{
        const images = await Image.find();

        return res.send({images});
    }catch(err){
        return res.status(400).send({error:'Erro carregando usuários'});
    }
});

router.get('/:controleID/:etapa', async(req, res)=>{
    const controleID = req.params.controleID;
    const etapa = req.params.etapa

    try{
        const images = await Image.find({controleRelacionado:controleID, etapaRelacionada:etapa})
        return res.send({
            images
        });
    }catch(err){
        console.log("Não encontrou");
        return res.status(400).send({error:'Importação não concluida'});
    }
});

router.delete('/:qualidadeId', async(req, res)=>{
    try{
        await Image.findByIdAndRemove(req.params.qualidadeId);
        return res.send();
     }catch(err){
         return res.status(400).send({error: 'Erro deletando registro'});
     }
});

router.put('/:qualidadeId', async(req, res)=>{
    const {id, aprovado} = req.body;
    console.log(id);
    try{
        const image = await Image.findByIdAndUpdate(id, req.body,{new:true});
        console.log(Image);
        return res.send({
            image
        });
    }catch(err){
        return res.status(400).send({error:'Atualização não efetuada'});
    }
});


module.exports = app => app.use('/images', router);