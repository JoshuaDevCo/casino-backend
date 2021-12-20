const express = require('express');
const Router = express.Router();
const GameModel = require('../models/Games');
const ProviderModel = require('../models/Providers');
const Games = GameModel.Games;
const GameTypes = GameModel.GameTypes;
const Providers = ProviderModel.Providers;
const URLparams = require("../middlewares/UrlParams");

Router.post("/updateGames", async (req, res) => {
    var data = req.body;
    data = data.providers;
    for(var i = 0; i < data.length; i ++){
        var games = data[i]['games'];
        for( var j = 0; j < games.length; j ++){
            var sdata = {};
            await Providers.findOne({ providerName : data[i]['name']}).then(async rdata => {
                if(!rdata){
                    console.log("not exist")
                } else {
                    sdata.provider = rdata._id;
                    sdata.gameType = rdata.gameType;
                    sdata.gameId = games[j]["name"];
                    sdata.gameName = games[j]["description"];
                    sdata.image = games[j]["image"] && games[j]["image"]["url"] ? games[j]["image"]["url"] : "";
                    sdata.status = true;
                    sdata.detail = {
                        category : games[j]["category"],
                        free : games[j]["free"],
                        charged : games[j]["charged"],
                        url : games[j]["url"] || {},
                        device : games[j]["device"]
                    }
                    await Games.findOne({ gameId : sdata.gameId }).then(async fdata => {                
                        if(fdata){
                            await Games.updateOne({ gameId : sdata.gameId }, sdata).then(rdata => {
                                rdata ? console.log("updated successfully") : console.log("update failed");
                            })
                        } else {
                            var savehandle = new Games( sdata );
                            savehandle.id = savehandle._id;
                            savehandle.save().then(rdata => {
                                rdata ? console.log("saved successfully") : console.log("save failed");
                            });
                        }
                    })  
                }
            })
        }
    }   
    res.json({status : true})
})

Router.get("/providers", (req, res) => {
    Games.find().distinct("provider").then(async rdata => {
        for(var i = 0; i < rdata.length; i ++){
            var savehandle = new Providers( {
                providerName : rdata[i],
                agregator : "WAC",
                gameType : ["CASINO, SLOTS"]
            } );
            savehandle.id = savehandle._id;
            await Providers.findOne({ id : savehandle.id }).then(fdata => {
                if(fdata){
                    console.log("exist")
                } else {
                    savehandle.save().then(rdata => {
                        rdata ? console.log("success") : console.log("failed");
                    });
                }
            })
        }
    })
    res.send("success")
})

// ** Declare Games Routers
Router.get("/getGamesCount", (req, res, next) => {
    URLparams(req, (params) => {
        var gameType = params.get("gameType");
        if(typeof(gameType) != "string")
            res.sendStatus(400);
        else {
            Games.find({gameType : gameType}, (err, rdata) => {
                if(err) 
                    res.sendStatus(500);
                else 
                    res.send(rdata.length.toString());
            })
        }
    });
})
Router.get("/getGamesByIndex", (req, res, next) => {
    URLparams(req, (params) => {
        var count = params.get("count");
        var start = params.get("start");
        var gameType = params.get("gameType");
        try{
            count = parseInt(count);
            start = parseInt(start);
        } catch(e){
            res.sendStatus(400);
            return;
        }
        if(typeof(count) != "number" || typeof(start) != "number" || typeof(gameType) != "string")
            res.sendStatus(400);
        else{
            if(count < 0 || start < 0){
                res.sendStatus(400);
                return;
            }
            Games.find({ gameType }).populate("provider").skip(start).limit(count).then((rdata) => {
                if(rdata){
                    res.send(rdata)
                } else {
                    res.sendStatus(500)
                }
            });
        }
    });  
})
Router.post("/getGameLunchUrl", (req, res) => {
    const { game, type } = req.body;
    res.send(`https://pi-test.njoybingo.com/game.do?pn=threeaces&lang=en&game=${game.gameId}&type=FREE`);
});
Router.post("/getGames", (req, res) => {
    let filter = {};
    if(req.body.name == "ALL")
        filter = {};
    else
        filter = { gameType : req.body.id };
    Games.find(filter).sort("order").populate("provider").populate("gameType").then(rdata => {
        res.send(rdata);
    }).catch(e => {
        res.send([]);
    })
})
Router.post("/addNewGame", (req, res) => {
    var savehandle = new Games( { ...req.body, status : true} );
    savehandle.id = savehandle._id;
    savehandle.save().then(rdata => {
        rdata ? res.send("success") : res.send("error")
    })
})
Router.post("/updateGame", (req, res) => {
    const data = req.body;
    const filter = { id : data.id };
    const update = data;
    Games.findOneAndUpdate(filter, update, (err) => {
        err ? res.send("error") : res.send("success");
    });
})
Router.post("/removeGames", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        await Games.deleteOne(filter);
    }
    res.send("success");
})
Router.post("/disableGames", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        const update = { status : false };
        await Games.findOneAndUpdate(filter, update);
    }
    res.send("success");
})
Router.post("/enableGames", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        const update = { status : true };
        await Games.findOneAndUpdate(filter, update);
    }
    res.send("success");
})

// ** Declare Game Type Routers
Router.get("/getGameTypes", (req, res) => {
    GameTypes.find().sort("order").then(rdata => {
        res.send(rdata);
    }).catch(e => {
        res.send(e);
    })
})
Router.post("/addNewGameType", (req, res) => {
    var savehandle = new GameTypes( { ...req.body, status : true} );
    savehandle.id = savehandle._id;
    savehandle.save().then(rdata => {
        rdata ? res.send("success") : res.send("error")
    })
})
Router.post("/updateGameType", (req, res) => {
    const data = req.body;
    const filter = { id : data.id };
    const update = data;
    GameTypes.findOneAndUpdate(filter, update, (err) => {
        err ? res.send("error") : res.send("success");
    });
})
Router.post("/removeGameTypes", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        await GameTypes.deleteOne(filter);
    }
    res.send("success");
})
Router.post("/disableGameTyeps", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        const update = { status : false };
        await GameTypes.findOneAndUpdate(filter, update);
    }
    res.send("success");
})
Router.post("/enableGameTypes", async (req, res) => {
    const data = req.body;
    for(var i = 0; i < data.length; i ++){
        const filter = { id : data[i] };
        const update = { status : true };
        await GameTypes.findOneAndUpdate(filter, update);
    }
    res.send("success");
})
module.exports = Router;