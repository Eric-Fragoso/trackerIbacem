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


module.exports = app => app.use('/images', router);