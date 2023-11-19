const express = require('express'); //Express is like a communicator with requests and responses for the website

const sessionRouter = express.Router();


sessionRouter.route('/')
.get((req,res)=>{
    res.render('sessions', {
        title: "Sessions",
        sessions:[
            {title: "Session 1", desc: "This is Session1"},
            {title: "Session 2", desc: "This is Session2"},
            {title: "Session 3", desc: "This is Session3"}
        ]})
})

sessionRouter.route('/:id')
.get((req,res)=>{
    const id = req.params.id;
    res.send('hello session nr ' + id);
})

module.exports = sessionRouter;