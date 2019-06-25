const express = require('express');
const authMiddleware = require('../middlewares/auth')
const router = express.Router();
const User = require('../models/user');

router.use(authMiddleware);

router.get('/', async (req, res)=>{
    try{
        const users = await User.find();

        return res.send({users});
    }catch(err){
        return res.status(400).send({error:'Erro carregando usuários'});
    }
});

router.get('/:userId', async(req, res)=>{
    res.send({ user: req.userId});
});

router.post('/', async(req, res)=>{
    res.send({ user: req.userId});
});

router.put('/:userId', async(req, res)=>{
    console.log(req.body, req.userId);
    try{
        const user = await User.findByIdAndUpdate(req.params.userId, req.body,{new:true});
        console.log(user);
        return res.send({
            user
        });
    }catch(err){
        return res.status(400).send({error:'Atualização não efetuada'});
    }
});

router.delete('/:userId', async(req, res)=>{
    try{
       await User.findByIdAndRemove(req.params.userId);
       return res.send();
    }catch(err){
        return res.status(400).send({error: 'Erro deletando usuário'});
    }
});

module.exports = app => app.use('/usuarios', router);