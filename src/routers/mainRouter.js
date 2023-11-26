const express = require('express');

const debug = require('debug')('app:sessionsRouter');
const mainRouter = express.Router();

const connection = require('../config/database/database');
const { render } = require('ejs');

mainRouter.route('/').post((req,resp)=>{

    res.render('index', {title: 'Royal Consulting', data: ['a', 'b', 'c']}); //instead of data, we can use json or database

});