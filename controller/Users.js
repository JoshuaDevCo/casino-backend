const express = require('express');
const Router = express.Router();
const { Users, Roles } = require('../models/Users');
const { Transactions } = require("../models/Finance");

Router.get("/getUsers", (req, res) => {
    Users.find().populate("userRole").populate("createdBy").then(rdata => {
        res.send(rdata);
    }).catch(e => {
        console.log(e);
        res.send([]);
    })
})

Router.post("/blockUsers", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        const update = { status : false };
        await Users.findOneAndUpdate(filter, update);
    }
    res.send("success");
})

Router.post("/enableUsers", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        const update = { status : true };
        await Users.findOneAndUpdate(filter, update);
    }
    res.send("success");
})

Router.post("/removeUsers", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        await Users.deleteOne(filter);
    }
    res.send("success");
})

Router.post("/updateUser", (req, res) => {
    const data = req.body;
    const filter = { id : data.id };
    const update = data;
    Users.findOneAndUpdate(filter, update, (err) => {
        err ? res.send("error") : res.send("success");
    });
})

Router.post("/addNewUser", (req, res) => {
    const data = req.body;
    Users.findOne({ email : data.email }).then(rdata => {
        if(rdata){
            res.send("exist")
        } else {
            var savehandle = new Users( data );
            savehandle.id = savehandle._id;
            savehandle.save().then(rdata => {
                rdata ? res.send("success") : res.send("failed");
            });
        }
    })
});

Router.post("/depositUser", (req, res) => {
    const request = req.body;
    Users.findOne({ id : request.id }).then(user => {
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
                            savehandle.id = savehandle._id;
                            savehandle.save().then(rdata => {
                                if(rdata){
                                    Users.findOneAndUpdate({ id : depositer.id }, depositerUpdate).then(rdata => {
                                        if(rdata){
                                            Users.findOneAndUpdate({ id : user.id }, userUpdate).then(rdata => {
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

Router.get("/getRoles", (req, res) => {
    Roles.find({}, (err, rdata) => {
        if(err) 
            res.sendStatus(500);
        else 
            res.json(rdata);
    })
})

Router.post("/addNewRole", (req, res) => {
    const data = req.body;
    var savehandle = new Roles( data );
    savehandle.id = savehandle._id;
    savehandle.save().then(rdata => {
        rdata ? res.send("success") : res.send("failed");
    });
});

Router.post("/disableRoles", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        const update = { status : false };
        await Roles.findOneAndUpdate(filter, update);
    }
    res.send("success");
})

Router.post("/enableRoles", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        const update = { status : true };
        await Roles.findOneAndUpdate(filter, update);
    }
    res.send("success");
})

Router.post("/removeRoles", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        await Roles.deleteOne(filter);
    }
    res.send("success");
})

Router.post("/updateRole", (req, res) => {
    const data = req.body;
    const filter = { id : data.id };
    const update = data;
    Roles.findOneAndUpdate(filter, update, (err) => {
        err ? res.send("error") : res.send("success");
    });
})

module.exports = Router;