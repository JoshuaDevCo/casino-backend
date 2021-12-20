var mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Today = new Date();
const users_schema = new Schema({
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
    userRole : { type: Schema.Types.ObjectId, ref: "roles" },
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
    createdBy : { type: Schema.Types.ObjectId, ref: "users" },
    updatedIn : String,
});

const roles_schema = new Schema({
    id : {type : String, unique : true, default : ""},
    name : {type : String, default : ""},
    pid : {type : String, default : ""},
    status : { type : Boolean, default : true }
});

const session = new Schema({
    email : { type : String, unique : true },
    socketId :  { type : String, default : ""},
    timestamp :  { type : String, default : ""},
})

const Users = mongoose.model('users', users_schema);
const Session = mongoose.model('session', session);
const Roles = mongoose.model('roles', roles_schema);

exports.Users = Users;
exports.Session = Session;
exports.Roles = Roles;