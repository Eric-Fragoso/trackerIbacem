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

router.get('/:controleID', async(req, res)=>{
    const controleID = req.params.controleID;

    try{
        const controles = await Controle.find({controleRelacionado:controleID})
        console.log(controles, controleID);
        return res.send({
            controles
        });
    }catch(err){
        console.log("Não encontrou");
        return res.status(400).send({error:'Importação não concluida'});
    }
});


module.exports = app => app.use('/images', router);