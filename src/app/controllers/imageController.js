const express = require('express');
const authMiddleware = require('../middlewares/auth')
const router = express.Router();
const Image = require('../models/image');

//router.use(authMiddleware);

router.get('/', async (req, res)=>{
    try{
        const images = await Image.find();

        return res.send({images});
    }catch(err){
        return res.status(400).send({error:'Erro carregando usuários'});
    }
});

router.get('/:imageId', async(req, res)=>{
    res.send({ image: req.imageId});
});

router.post('/', async(req, res)=>{
    try{
        const image = await Image.create(req.body);
        return res.send({image});
    }catch(err){
        return res.status(400).send({error:'Imagem não cadastrada'});
    }
});

router.put('/:imageId', async(req, res)=>{
    res.send({image: req.imageId});
});

router.delete('/:imageId', async(req, res)=>{
    try{
       await Image.findByIdAndRemove(req.params.imageId);
       return res.send();
    }catch(err){
        return res.status(400).send({error: 'Erro deletando usuário'});
    }
});

module.exports = app => app.use('/images', router);