const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/ibctracker', { useNewUrlParser: true, useCreateIndex:true })
mongoose.Promise = global.Promise;


module.exports = mongoose;