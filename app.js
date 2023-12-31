const express = require('express'); //Express is like a communicator with requests and responses for the website
const chalk = require('chalk'); //Chalk is used to color console messages for easier understanding and debugging
const debug = require('debug')('app'); /* We use this so that we have 'debug' messages only when we run 'DEBUG=* node app.js' 
                                            Or we can even use 'DEBUG=app node app.js' to display only what the we told we want
                                            to hear from the 'app'
                                        */

const morgan = require('morgan'); //Middleware. Basically it receives info from what device people visit the website
const path = require('path');
const sessionRouter = require('./src/routers/sessionRouter');
const authRouter = require('./src/routers/authRouter');
const mainRouter = require('./src/routers/mainRouter');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const PORT = process.env.PORT || 3000; //Takes PORT from env in json OR 3000 if it can't find env.PORT

const app = express(); //Making an express common app

app.use(morgan('combined')); //'combined' gives a lot of info, tiny gives less
app.use(express.static(path.join(__dirname, '/public'))); //looks for the static 'index.html
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cookieParser());
app.use(session({secret: 'mySecret'}));

//Database connection
const connection = require('./src/config/database/database.js');


require('./src/config/passport.js')(app);

app.set('views', './src/views'); //sets default views to 'index.ejs'
app.set('view engine', 'ejs'); //sets view engine to ejs

app.use('/', mainRouter);

app.use('/profile', sessionRouter) //For '/sessions' on the browser, we use the sessionRouter
app.use('/auth', authRouter);

//App runs on port PORT and 'listens'
app.listen(PORT, ()=>{
    debug(`Listening on port ${chalk.green(PORT)}`);
})

process.on('uncaughtException', err => {
    debug(err);
})