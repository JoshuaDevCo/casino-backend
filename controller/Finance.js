const express = require('express');
const Router = express.Router();
const model = require('../models/Finance');
const Transactions = model.Transactions;

Router.get("/getTransactions", (req, res) => {
    Transactions.find({}, (err, rdata) => {
        if(err) 
            res.sendStatus(500);
        else 
            res.send(rdata);
    })
})

module.exports = Router;