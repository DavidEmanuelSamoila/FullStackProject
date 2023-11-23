const express = require('express');
const debug = require('debug')('app:sessionsRouter');

const authRouter = express.Router();

const connection = require('../config/database/database');
const { render } = require('ejs');

authRouter.route('/signUp').post((req,res)=>{
    const {username,password} = req.body; //Create User
    connection.query(`SELECT username FROM profiles WHERE username='${username}'`,(err, result, fields)=>{
        if(err)
        {
            debug(err);
            return;
        } else if (result.length === 0) //If there's no user with this username
        {

            const sql = `INSERT INTO profiles (username,password) VALUES ?`;
            const user = req.body;//[[username,password]];
            connection.query(`INSERT INTO profiles (username,password) VALUES ('${username}','${password}')`, (error, result)=>{
            if (error)
            {
                debug(error);
                return;
            }

            debug("User successfully added.");

            });

            debug("Tried to create user");

        } else if(password !== result[0].password) //If there's a wrong password
        {

            debug('Wrong password');

        } else //If user can Log In
        {

            debug('Logged in successfully');

        }

    });

    req.login(req.body, ()=>{
        res.redirect('/auth/profile')
    });
});

authRouter.route('/profile').get((req,res)=>{
    //res.json(req.user);
    connection.query(`SELECT username FROM profiles WHERE username='admin'`, (err, result)=>{
        if (err)
            debug(err);
        res.render('sessions', {result});
        
    });
});

module.exports = authRouter;