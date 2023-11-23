const express = require('express');
const debug = require('debug')('app:sessionsRouter');

const authRouter = express.Router();

const connection = require('../config/database/database');
const { render } = require('ejs');

authRouter.route('/signUp').post((req,res)=>{
    const {username,password} = req.body; //Create User
    connection.query(`SELECT username FROM profiles WHERE username=?`,username,(err, result)=>{
        if(err)
        {
            const sql = `INSERT INTO profiles (username,password) VALUES ?`;
            const user = [[username,password]];
            connection.query(sql, [user], (error, result)=>{
                if (error)
                {
                    debug(error);
                    return;
                }

                debug("User successfully added.")
            });
            return;
        }
        debug("All good");
        //res.send(result);
    });

    req.login(req.body, ()=>{
        res.redirect('/auth/profile')
    });
});

authRouter.route('/profile').get((req,res)=>{
    res.json(req.user);
    connection.query(`SELECT username FROM profiles`, (err, result)=>{
        if (err)
            debug(err);
        //res.render('sessions', result);
        
    });
});

module.exports = authRouter;