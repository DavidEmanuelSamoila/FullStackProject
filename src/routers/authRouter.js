const express = require('express');

const debug = require('debug')('app:authRouter');
const authRouter = express.Router();

const connection = require('../config/database/database');
const { render } = require('ejs');

authRouter.route('/login').post((req,resp)=>{
    const {username,password} = req.body;//Get data from user form
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

authRouter.route('/signUp').post((req,resp)=>{

    const {username,password,company} = req.body; //Get data from user form
    connection.query(`SELECT * FROM profiles WHERE username='${username}'`,(error, result, fields)=>{
        
        if(error)
        {
            debug(error);
            return;
        } else if (result.length === 0) //If there's no user with this username
        {

            connection.query(`SELECT * FROM userRequests WHERE username='${username}'`,(er,re,fi)=>{

                if (er)
                {
                    debug(er);
                    return;
                } else if (re.length === 0)
                {

                    connection.query(`INSERT INTO userRequests (username,password,company) VALUES ('${username}','${password}', '${company}')`, (err, res)=>{
                        if (err)
                        {
                            debug(err);
                            return;
                        }
            
                        debug("User successfully added.");
            
                        });

                }

                resp.redirect('/'); //user is in userRequests and has to wait for admin approoval
                
            });

        } 

        req.login(req.body, ()=>{

            resp.redirect('/login');

        });

    });

});

authRouter.route('/additem').post((req,resp)=>{

    const user = req.user;
    const username = user.username;
    const {sku,manufacturer,top,colour,stock,cpu} = req.body; //Get data from item form

    connection.query(`SELECT company FROM profiles WHERE username='${username}'`,(error,result)=>{

        const company = result[0].company;

        connection.query(`SELECT * FROM inventory WHERE sku='${sku}'`,(error, result, fields)=>{

            if (error)
            {
                debug(error);
                return;
            } else if (result.length > 0) //item already exists
            {
    
                connection.query(`UPDATE inventory SET manufacturer='${manufacturer}', top='${top}', colour='${colour}', stock=${stock}, cpu=${cpu} WHERE sku=${sku} AND company='${company}'`,(error, r, fields)=>{
    
                    if (error)
                    {
                        debug(error);
                        return;
                    }
    
                });
    
            } else{
    
                connection.query(`INSERT INTO inventory (sku,manufacturer,top,colour,stock,cpu,company) VALUES ('${sku}','${manufacturer}','${top}','${colour}',${stock},${cpu},'${company}')`, (error, r, fields)=>{
    
                    if (error)
                    {
                        debug(error);
                        return;
                    } 
                });
    
            }
    
            resp.redirect('/profile/inventory');
    
        });

    });

});

module.exports = authRouter;