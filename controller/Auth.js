const express = require('express');
const Router = express.Router();
const model = require('../models/Users');
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config");
const Users = model.Users;
const Players = model.Players;

generateAccessToken = (auth_data) => {
    return jwt.sign(auth_data, TOKEN_SECRET, { expiresIn: '3600s' });
}

/* JWT Authentication */
authenticateToken = (req, res, next) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
      if (err) return res.send(err)
      next() // pass the execution off to whatever request the client intended
    })
}

Router.post("/signin", (req, res, next) => {
    var data = req.body;
    var token = null;
    Users.findOne({ email : data.email, password : data.password }, (err , rdata)=>{
        if(err){
            res.send("error")
        }else{
            if(rdata == null){
                res.send("not found");
            } else {
                if(rdata.status){
                    token = generateAccessToken({auth_data : rdata});
                    console.log(`${rdata.email} just signed in`);
                    res.send({
                        token : token,
                        data : rdata
                    })
                } else {
                    res.send("block");
                }
            }
        }
    })
});

Router.post("/sessionCheck", async (req, res, next) => {
    var token = await generateAccessToken({auth_data : req.body});
    Users.findOne({email : req.body.email}).then((rdata) => {
        res.json({
            data : rdata,
            token : token
        });
    })
});

Router.post("/players/session", async (req, res, next) => {
    var token = await generateAccessToken({auth_data : req.body});
    Players.findOne({email : req.body.email}).then((rdata) => {
        res.json({
            data : rdata,
            token : token
        });
    })
});

module.exports = Router;
