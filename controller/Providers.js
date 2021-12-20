const express = require('express');
const Router = express.Router();
const model = require('../models/Providers');
const Providers = model.Providers;

Router.post("/addNewProvider", (req, res) => {
    const data = req.body;
    var savehandle = new Providers( data );
    savehandle.id = savehandle._id;
    Providers.findOne({ id : savehandle.id }).then(rdata => {
        if(rdata){
            res.send("exist")
        } else {
            savehandle.save().then(rdata => {
                rdata ? res.send("success") : res.send("failed");
            });
        }
    })
})

Router.post("/updateProvider", (req, res) => {
    const data = req.body;
    const filter = { id : data.id };
    const update = data;
    Providers.findOneAndUpdate(filter, update, (err) => {
        err ? res.send("error") : res.send("success");
    });
})

Router.post("/removeProviders", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        await Providers.deleteOne(filter);
    }
    res.send("success");
})

Router.post("/disableProviders", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        const update = { status : false };
        await Providers.findOneAndUpdate(filter, update);
    }
    res.send("success");
})

Router.post("/enableProviders", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        const update = { status : true };
        await Providers.findOneAndUpdate(filter, update);
    }
    res.send("success");
})

Router.post("/getProviders", (req, res) => {
    let filter = {};
    if(req.body.name == "ALL")
        filter = {};
    else
        filter = { gameType : req.body.id };
    Providers.find(filter).sort("order").populate("gameType").then(rdata => {
        res.send(rdata);
    }).catch(e => {
        res.send([]);
    })
})

module.exports = Router;