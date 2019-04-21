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
    res.send({user: req.userId});
});

router.delete('/:userId', async(req, res)=>{
    res.send({user: req.userId});
});

module.exports = app => app.use('/usuarios', router);