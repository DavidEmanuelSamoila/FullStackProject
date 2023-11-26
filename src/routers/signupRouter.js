const express = require('express');

const debug = require('debug')('app:signupRouter');
const signupRouter = express.Router();

const connection = require('../config/database/database');
const { render } = require('ejs');


signupRouter.route('/').get((req,res)=>{

    res.render('signup', {title: 'Royal Consulting'});

});

module.exports = signupRouter;