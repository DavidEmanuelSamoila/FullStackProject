const express = require('express'); //Express is like a communicator with requests and responses for the website

const sessionRouter = express.Router();


sessionRouter.route('/')
.get((req,res)=>{
    res.render('sessions', req.body)
})

sessionRouter.route('/:id')
.get((req,res)=>{
    const id = req.params.id;
    res.send('hello session nr ' + id);
})

module.exports = sessionRouter;