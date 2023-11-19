const express = require('express'); //Express is like a communicator with requests and responses for the website
const chalk = require('chalk'); //Chalk is used to color console messages for easier understanding and debugging
const app = express(); //Making an express common app

//This runs when the app is initialized/started
app.get('/', (req,res)=>{
    res.send('Hello from my app!');
});

//App runs on port 3000 and 'listens'
app.listen(3000, ()=>{
    console.log('Listening on port ' + chalk.green('3000'));
})