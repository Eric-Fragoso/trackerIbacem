const express = require('express');
const authMiddleware = require('../middlewares/auth')
const router = express.Router();

router.use(authMiddleware);

router.get('/',(req, res)=>{
    res.send({user: req.userId});
});

router.get('/:controleId', async(req, res)=>{
    res.send({ user: req.userId});
});

router.post('/', async(req, res)=>{
    res.send({ user: req.userId});
});

router.put('/:controleId', async(req, res)=>{
    res.send({user: req.userId});
});

router.delete('/:controleId', async(req, res)=>{
    res.send({user: req.userId});
});

module.exports = app => app.use('/controles', router);