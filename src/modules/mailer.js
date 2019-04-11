const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const {host, port, user, pass} = require('../config/mailer.json')

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {user, pass},
  });


  const exphbs = require('express-handlebars');

  const viewPath = path.resolve('./resource/mail/');

transport.use('compile', hbs({
  viewEngine: exphbs.create({ partialsDir: path.resolve('./src/resources/mail/partials') }),
  viewPath,
  extName: '.html'
}));

  module.exports = transport;