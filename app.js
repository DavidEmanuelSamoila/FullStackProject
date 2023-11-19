const express = require('express'); //Express is like a communicator with requests and responses for the website
const chalk = require('chalk'); //Chalk is used to color console messages for easier understanding and debugging

const debug = require('debug')('app'); /* We use this so that we have 'debug' messages only when we run 'DEBUG=* node app.js' 
                                            Or we can even use 'DEBUG=app node app.js' to display only what the we told we want
                                            to hear from the 'app'
                                        */

const morgan = require('morgan'); //Middleware. Basically it receives info from what device people visit the website

const app = express(); //Making an express common app

app.use(morgan('tiny')); //'combined' gives a lot of info, tiny gives less

//This runs when the app is initialized/started
app.get('/', (req,res)=>{
    res.send('Hello from my app!');
});

//App runs on port 3000 and 'listens'
app.listen(3000, ()=>{
    debug(`Listening on port  + ${chalk.green('3000')}`);
})