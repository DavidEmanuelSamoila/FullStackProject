const express = require('express'); //Express is like a communicator with requests and responses for the website

const sessionRouter = express.Router();

const connection = require('../config/database/database');

const debug = require('debug')('app:sessionsRouter');
const { render } = require('ejs');

sessionRouter.route('/')
.get((req,res)=>{
    if (!req.isAuthenticated()) {
        // If not authenticated, redirect to the login page or handle as appropriate
        return res.redirect('/login'); // Change '/login' to the actual login route
    }
    
    const authenticatedUsername = req.user.username;
    connection.query(`SELECT * FROM profiles WHERE username='${authenticatedUsername}'`, (err, result)=>{
        if (err)
        {
            debug(err);
            return res.status(500).send('Internal Server Error');
        }
        
        if (result.length === 0)
            return res.status(404).send('User not found');
        
        if (req.accepts('html'))
            res.render('sessions', { user: result[0] });
        else
            res.json(result);  
        
        debug(result);
        
    });
})

sessionRouter.route('/:id')
.get((req,res)=>{
    const id = req.params.id;
    res.send('hello session nr ' + id);
})

sessionRouter.route('/profile').get((req,res)=>{
    
});

module.exports = sessionRouter;