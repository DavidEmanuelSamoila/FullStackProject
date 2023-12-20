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
                } else if (re.length === 0) //If there is already a user request with that username
                {

                    connection.query(`INSERT INTO userRequests (username, password, company) VALUES ('${username}', '${password}', '${company}')`,(err)=>{
                        if(err)
                        {
   
                            debug(err);
                            return;
                        }
                    });

                }

                resp.redirect('/'); //user is in userRequests and has to wait for admin approoval
                
            });

        } 

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
    
                connection.query(`UPDATE inventory SET manufacturer='${manufacturer}', top='${top}', colour='${colour}', stock=${stock}, cpu=${cpu} WHERE sku='${sku}' AND company='${company}'`,(error, r, fields)=>{
    
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

authRouter.route('/remitem').post((req,resp)=>{

    const user = req.user;
    const username = user.username;
    const {sku} = req.body; //Get data from item form
    debug(sku);
    connection.query(`SELECT company FROM profiles WHERE username='${username}'`,(error,result)=>{

        const company = result[0].company;

        connection.query(`SELECT * FROM inventory WHERE sku='${sku}'`,(error, result, fields)=>{

            if (error)
            {
                debug(error);
                return;
            } else if (result.length > 0) //item already exists
            {
                
                connection.query(`DELETE FROM inventory WHERE sku='${sku}' AND company='${company}'`,(error, r, fields)=>{
    
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

authRouter.route('/adduser').post((req,resp)=>{

    const user = req.user;
    const adminname = user.username;
    const {userID, username, level} = req.body;

    connection.query(`SELECT company FROM profiles WHERE username='${adminname}'`,(error,re)=>{

        const admincompany = re[0].company;

        connection.query(`SELECT * FROM userRequests WHERE username='${username}' AND company='${admincompany}'`,(err, result)=>{
            if(err)
            {
                debug(err);
                return;
            } else if (result.length > 0) //If there is such request, proceed
            {
    
                connection.query(`INSERT INTO profiles (username,password,company,level) VALUES ('${username}', '${result[0].password}', '${result[0].company}', ${level})`);
                connection.query(`DELETE FROM userRequests WHERE username='${username}' AND company='${admincompany}'`,(er)=>{
                    if(er)
                    {
                        debug(er);
                        return;
                    }
                });
    
            }
    
            resp.redirect('/profile/employees');

        });

    });
    
});

authRouter.route('/remuser').post((req,resp)=>{

    const user = req.user;
    const adminname = user.username;
    const {username} = req.body;

    connection.query(`SELECT company FROM profiles WHERE username='${adminname}'`,(error,re)=>{

        const admincompany = re[0].company;

        connection.query(`SELECT * FROM profiles WHERE username='${username}' AND company='${admincompany}'`,(err, result)=>{
            if(err)
            {
                debug(err);
                return;
            } else if (result.length > 0) //If there is such user, proceed
            {
    
                connection.query(`DELETE FROM profiles WHERE username='${username}' AND company='${admincompany}'`, (err)=>{
                    if(err)
                    {
                        debug(err);
                        return;
                    }
                });
    
            }
    
            resp.redirect('/profile/employees');

        });

    });
    
});

authRouter.route('/decuser').post((req,resp)=>{

    const user = req.user;
    const adminname = user.username;
    const {username} = req.body;

    connection.query(`SELECT company FROM profiles WHERE username='${adminname}'`,(error,re)=>{

        const admincompany = re[0].company;

        connection.query(`SELECT * FROM userRequests WHERE username='${username}' AND company='${admincompany}'`,(err, result)=>{
            if(err)
            {
                debug(err);
                return;
            } else if (result.length > 0) //If there is such user, proceed
            {
    
                connection.query(`DELETE FROM userRequests WHERE username='${username}' AND company='${admincompany}'`, (err)=>{
                    if(err)
                    {
                        debug(err);
                        return;
                    }
                });
    
            }
    
            resp.redirect('/profile/employees');

        });

    });
    
});

authRouter.route('/addcli').post((req,resp)=>{

    const user = req.user;
    const adminname = user.username;
    const {name,surname,email,phone,promo,shipname,address,province,postcode} = req.body;

    connection.query(`SELECT company FROM profiles WHERE username='${adminname}'`,(error,re)=>{

        const admincompany = re[0].company;

        connection.query(`SELECT phone FROM clients WHERE phone='${phone}' AND company='${admincompany}'`, (err,result)=>{
            if(err)
            {
                debug(err);
                return;
            } else if(result.length === 0) //When user with this phone number does not exist
            {

                connection.query(`INSERT INTO clients (name,surname,email,phone,shipname,address,province,postcode,company) VALUES ('${name}','${surname}','${email}',${phone},'${shipname}','${address}','${province}','${postcode}','${admincompany}')`,(er)=>{

                    if(er){
                        debug(er);
                        return;
                    }

                });

            }

            resp.redirect('/profile/clients');

        })

    });

});


authRouter.route('/remcli').post((req,resp)=>{

    const user = req.user;
    const adminname = user.username;
    const {phone} = req.body;

    connection.query(`SELECT company FROM profiles WHERE username='${adminname}'`,(error,re)=>{

        const admincompany = re[0].company;

        connection.query(`DELETE FROM clients WHERE phone=${phone}`)

        resp.redirect('/profile/clients');

    });

});

authRouter.route('/addbus').post((req,resp)=>{

    const user = req.user;
    const adminname = user.username;
    const {name,number,type,shipaddress,province,postcode,contname,contsurname,email,phone} = req.body;

    connection.query(`SELECT company FROM profiles WHERE username='${adminname}'`,(error,re)=>{

        const admincompany = re[0].company;

        connection.query(`SELECT phone FROM businesses WHERE phone=${phone} AND company='${admincompany}'`, (err,result)=>{
            if(err)
            {
                debug(err);
                return;
            } else if(result.length === 0) //When user with this phone number does not exist
            {

                connection.query(`INSERT INTO businesses (name,number,type,address,province,postcode,contname,contsurname,email,phone,company) VALUES ('${name}','${number}','${type}','${shipaddress}','${province}','${postcode}','${contname}','${contsurname}','${email}',${phone},'${admincompany}')`,(er)=>{

                    if(er){
                        debug(er);
                        return;
                    }

                });

            }

            resp.redirect('/profile/clients');

        })

    });

});

authRouter.route('/rembus').post((req,resp)=>{

    const user = req.user;
    const adminname = user.username;
    const {phone} = req.body;

    connection.query(`SELECT company FROM profiles WHERE username='${adminname}'`,(error,re)=>{

        const admincompany = re[0].company;

        connection.query(`DELETE FROM businesses WHERE phone=${phone}`)

        resp.redirect('/profile/clients');

    });

});

module.exports = authRouter;