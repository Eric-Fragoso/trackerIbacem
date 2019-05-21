#!/usr/bin/env node
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

console.log(express.static(__dirname));

app.use('/enviadas', express.static(__dirname  + '/uploads'));
app.use('/portal', express.static(__dirname  + '/front'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan("dev"));
require('./app/controllers/index')(app);


app.listen(3322); 