const express = require('express');

const debug = require('debug')('app:sessionsRouter');
const authRouter = express.Router();

const connection = require('../config/database/database');
const { render } = require('ejs');

authRouter.route('/signUp').post((req,resp)=>{
    const {username,password} = req.body; //Create User
    connection.query(`SELECT * FROM profiles WHERE username='${username}'`,(error, result, fields)=>{
        
        const firstRow = result[0];
        const pass = result.password;
        
        if(error)
        {
            debug(error);
            return;
        } else if (result.length === 0) //If there's no user with this username
        {

            req.login(req.body, ()=>{

                resp.redirect('/signUp');
            });

            /* connection.query(`INSERT INTO profiles (username,password) VALUES ('${username}','${password}')`, (err, res)=>{
            if (err)
            {
                debug(err);
                return;
            }

            debug("User successfully added.");

            });
            */
            debug("Redirected to /signUp...");

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

                        resp.redirect('/profile');
                    });

                }

            });

        }

    });

});



module.exports = authRouter;