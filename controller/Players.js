const express = require('express');
const Router = express.Router();
const { Players } = require('../models/Players');
const { Users } = require('../models/Users');
const { Transactions } = require("../models/Finance");

Router.get("/getPlayers", (req, res) => {
    Players.find({}, (err, rdata) => {
        if(err) 
            res.sendStatus(500);
        else 
            res.send(rdata);
    })
})

Router.post("/blockPlayers", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        const update = { status : false };
        await Players.findOneAndUpdate(filter, update);
    }
    res.send("success");
})

Router.post("/enablePlayers", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        const update = { status : true };
        await Players.findOneAndUpdate(filter, update);
    }
    res.send("success");
})

Router.post("/removePlayers", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        await Players.deleteOne(filter);
    }
    res.send("success");
})

Router.post("/updatePlayer", (req, res) => {
    const data = req.body;
    const filter = { id : data.id };
    const update = data;
    Players.findOneAndUpdate(filter, update, (err) => {
        err ? res.send("error") : res.send("success");
    });
})

Router.post("/addNewPlayer", (req, res) => {
    const data = req.body;
    Players.findOne({ email : data.email }).then(rdata => {
        if(rdata){
            res.send("exist")
        } else {
            var savehandle = new Players( data );
            savehandle.id = savehandle._id;
            savehandle.save().then(rdata => {
                rdata ? res.send("success") : res.send("failed");
            });
        }
    })
})

Router.post("/depositPlayer", (req, res) => {
    const request = req.body;
    Players.findOne({ id : request.id }).then(user => {
        if(user){
            Users.findOne({ id : request.depositerId}).then(depositer => {
                switch(request.category){
                    case "cash": {
                        if(parseFloat(depositer.balance) >= parseFloat(request.amount)){
                            const depositerBalance = parseFloat(depositer.balance) - parseFloat(request.amount);
                            const userBalance = parseFloat(user.balance) + parseFloat(request.amount);
                            const depositerUpdate = { balance : depositerBalance };
                            const userUpdate = { balance : userBalance };
                            const transaction = {
                                id: new Date().getTime(),
                                fromId: depositer.id,
                                fromName: `${depositer.firstname} ${depositer.lastname}`,
                                toId: user.id,
                                toName: `${user.firstname} ${user.lastname}`,
                                amount: request.amount,
                                type: "deposit",
                                category:  request.category,
                                fromLastBalance: depositer.balance,
                                fromUpdatedBalance: depositerBalance,
                                toLastBalance: user.balance,
                                toUpdatedBalance: userBalance,
                                commission: 0,
                                currency: user.currency,
                                description: request.description,
                            };
                            var savehandle = new Transactions( transaction );
                            savehandle.save().then(rdata => {
                                if(rdata){
                                    Users.findOneAndUpdate({ id : depositer.id }, depositerUpdate).then(rdata => {
                                        if(rdata){
                                            Players.findOneAndUpdate({ id : user.id }, userUpdate).then(rdata => {
                                                if(rdata){
                                                    res.send("success");
                                                } else {
                                                    res.send("error");
                                                }
                                            })
                                        } else {
                                            res.send("error");
                                        }
                                    }).catch(() => {
                                        res.send("error");
                                    })
                                } else {
                                    res.send("error");
                                }
                            });
                        } else {
                            res.send("balance error");
                        }
                        break;
                    }
                    case "bonus": {
                        if(parseFloat(depositer.bonusbalance) >= parseFloat(request.amount)){

                        } else {
                            res.send("balance error");
                        }
                        break;
                    }
                    default: {
                        res.send("category error")
                    }
                }
            });           
        } else {
            res.send("error")
        }
    }).catch(() => {
        res.send("error")
    })
})

module.exports = Router;