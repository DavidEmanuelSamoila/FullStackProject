const express = require('express');

const debug = require('debug')('app:loginRouter');
const loginRouter = express.Router();

const connection = require('../config/database/database');
const { render } = require('ejs');

loginRouter.route('/').get((req,res)=>{

    res.render('login', {title: 'Royal Consulting'}); //Empty object cause for now we don't need info passed to login

});

module.exports = loginRouter;