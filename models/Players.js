var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Today = new Date();
const players_schema = new Schema({
    id : {type : String, unique : true, default : ""},
    email : { type : String, unique : true, default : ""},
    password : { type : String, default : "" },
    firstname : { type : String, default : "" },
    lastname : { type : String, default : "" },
    gender : { type : String, default : "" },
    birthday : { type : String, default : "" },
    phone : { type : String, default : "" },
    address : { type : String, default : "" },
    ip : {type : String, default : ""},
    country : { type : String, default : "" },
    zipCode : { type : String, default : ""},
    company : { type : String, default : "" },
    avatar :{ type : String, default : "" },
    joinedIn : { type : String, default : Today.toString() },
    status : { type : Boolean, default : true },
    currency : { type : String, default : "USD"},
    balance : { type : Number, default : 0 },
    bonusbalance : { type : Number, default : 0},
    idVerify : { type : Boolean, default : false},
    emailVerify : { type : Boolean, default : false},
    subscribe : { type : Boolean, default : false},
    firstDeposit : { type : String, default : ""},
    updatedIn : String,
});
const Players = mongoose.model('players', players_schema);
exports.Players = Players;