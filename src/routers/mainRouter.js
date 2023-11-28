const express = require('express');

const debug = require('debug')('app:loginRouter');
const mainRouter = express.Router();

const connection = require('../config/database/database');
const { render } = require('ejs');

mainRouter.route('/login').get((req,res)=>{

    res.render('login', {title: 'Royal Consulting'}); //Empty object cause for now we don't need info passed to login

});

mainRouter.route('/signup').get((req,res)=>{

    res.render('signup', {title: 'Royal Consulting'});

});

mainRouter.route('/').get((req,res)=>{
    res.render('index', {title: 'Royal Consulting', data: ['a', 'b', 'c']}); //instead of data, we can use json or database
});

module.exports = mainRouter;