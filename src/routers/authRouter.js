const express = require('express');

const debug = require('debug')('app:sessionsRouter');
const authRouter = express.Router();

const connection = require('../config/database/database');
const { render } = require('ejs');

authRouter.route('/signUp').post((req,resp)=>{
    const {username,password} = req.body; //Create User
    connection.query(`SELECT username FROM profiles WHERE username='${username}'`,(error, result, fields)=>{
        
        const firstRow = result[0];
        const pass = result.password;
        
        if(error)
        {
            debug(error);
            return;
        } else if (result.length === 0) //If there's no user with this username
        {

            connection.query(`INSERT INTO profiles (username,password) VALUES ('${username}','${password}')`, (err, res)=>{
            if (err)
            {
                debug(err);
                return;
            }

            debug("User successfully added.");

            });

            debug("Tried to create user");

        } else //If username is found
        {

            connection.query(`SELECT password FROM profiles WHERE username='${username}' AND password='${password}'`,(err, res)=>{
                
                if(res.length === 0) //If wrong password
                {

                    debug('Wrong password');

                } else //If correct username and password
                {

                    debug('Logged in successfully');

                    req.login(req.body, ()=>{

                        resp.redirect('/auth/profile');
                    });

                }

            });

        }

    });

});

authRouter.route('/profile').get((req,res)=>{
    if (!req.isAuthenticated()) {
        // If not authenticated, redirect to the login page or handle as appropriate
        return res.redirect('/login'); // Change '/login' to the actual login route
    }
    
    const authenticatedUsername = req.user.username;
    connection.query(`SELECT username FROM profiles WHERE username='${authenticatedUsername}'`, (err, result)=>{
        if (err)
        {
            debug(err);
            return res.status(500).send('Internal Server Error');
        }
        
        if (result.length === 0)
            return res.status(404).send('User not found');
        
        if (req.accepts('html'))
            res.render('sessions', { result });
        else
            res.json(result);   
        
    });
});

module.exports = authRouter;