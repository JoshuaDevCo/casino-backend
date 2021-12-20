const express = require('express');
const Router = express.Router();
const CryptoJS = require("crypto-js");
const fs = require('fs')

Router.get("/getServerConfig", async (req, res) => {
    try {
        fs.readFile(`config.json`, 'utf-8', (err, data) => {
            if(!err){
                data = CryptoJS.AES.encrypt(data, 'ibludaycasinoapp')
                res.send(data.toString());
            } else (
                res.send(false)
            )
        });
    } catch (err) {
        res.send(false)
    }
})

module.exports = Router;