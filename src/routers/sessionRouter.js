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
            res.render('profile', { user: result[0]});
        else
            res.json(result);  
        
        //debug(result);
        
    });
})

sessionRouter.route('/inventory').get((req,res)=>{
    const username = req.user.username;
    connection.query(`SELECT company,level FROM profiles WHERE username='${username}'`, (err,result)=>{
       
        const company = result[0].company;
        const level = result[0].level;

        connection.query(`SELECT * FROM inventory WHERE company='${company}'`, (err,r)=>{

            if (err)
            {
                debug(err);
                return;
            } else {
    
                debug(r);
                if (req.accepts('html'))
                {
                    res.render('inventory', { user: {username: username, company: company, level: level}, inventory: r});
                }
                else
                    res.redirect('/');
            }
    
        });

    })

});

sessionRouter.route('/manufacturers').get((req,res)=>{
    const username = req.user.username;
    connection.query(`SELECT company,level FROM profiles WHERE username='${username}'`, (err,result)=>{
       
        const company = result[0].company;
        const level = result[0].level;

        connection.query(`SELECT * FROM inventory WHERE company='${company}'`, (err,r)=>{

            if (err)
            {
                debug(err);
                return;
            } else {
    
                debug(r);
                if (req.accepts('html'))
                {
                    res.render('maninfo', { user: {username: username, company: company, level: level}, inventory: r});
                }
                else
                    res.redirect('/');
            }
    
        });

    })

});

sessionRouter.route('/clients').get((req,res)=>{
    const username = req.user.username;
    connection.query(`SELECT company,level FROM profiles WHERE username='${username}'`, (err,result)=>{
       
        const company = result[0].company;
        const level = result[0].level;

        connection.query(`SELECT * FROM clients WHERE company='${company}'`, (err,r)=>{

            if (err)
            {
                debug(err);
                return;
            } else {
    
                connection.query(`SELECT * FROM businesses WHERE company='${company}'`,(err, re)=>{

                    if(err)
                    {
                        debug(err);
                        return;
                    }

                    if (req.accepts('html'))
                    {
                        res.render('clinfo', { user: {username: username, company: company, level: level}, clients: r, businesses: re});
                    }
                    else
                        res.redirect('/');

                });

            }
    
        });

    })

});

sessionRouter.route('/employees').get((req,res)=>{
    const username = req.user.username;
    connection.query(`SELECT company,level FROM profiles WHERE username='${username}'`, (err,result)=>{
       
        const company = result[0].company;
        const level = result[0].level;

        connection.query(`SELECT * FROM profiles WHERE company='${company}'`, (err,r)=>{

            if (err)
            {
                debug(err);
                return;
            } else {
    
                connection.query(`SELECT * FROM userRequests WHERE company='${company}'`, (err, re)=>{

                    if (err)
                    {
                        debug(err);
                        return;
                    }

                    if (req.accepts('html'))
                    {
                        res.render('empinfo', { user: {username: username, company: company, level: level}, employees: r, empreqs: re});
                    }
                    else
                        res.redirect('/');

                    });
            }
    
        });

    })

});

sessionRouter.route('/pricing').get((req,res)=>{
    const username = req.user.username;
    connection.query(`SELECT company,level FROM profiles WHERE username='${username}'`, (err,result)=>{
       
        const company = result[0].company;
        const level = result[0].level;

        connection.query(`SELECT * FROM priceList WHERE company='${company}'`, (err,r)=>{

            if (err)
            {
                debug(err);
                return;
            } else {
    
                connection.query(`SELECT * FROM priceRequests WHERE company='${company}'`, (err, re)=>{

                    if (err)
                    {
                        debug(err);
                        return;
                    }

                    if (req.accepts('html'))
                    {
                        res.render('pricing', { user: {username: username, company: company, level: level}, priceList: r, priceReqs: re});
                    }
                    else
                        res.redirect('/');

                    });
            }
    
        });

    })

});

sessionRouter.route('/sales').get((req,res)=>{
    res.redirect('/profile');
});

sessionRouter.route('/docs').get((req,res)=>{
    res.redirect('/profile');
});

sessionRouter.route('/orders/:id')
.get((req,res)=>{
    const username = req.user.username;
    const company = req.user.company;
    const id = req.params.id;
    res.render('sessions', { user: {username: username, company: company}, page: 'orders', orderNumber: id})
});


module.exports = sessionRouter;