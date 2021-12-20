var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProvidersSchema = new Schema({
    id : { type : String, unique : true, default : ""},
    order : { type : Number, default : 0},
    providerName : { type : String, default : "" },
    agregator : { type : String, default : "" },
    lunchType : { type : String, default : "" },
    route : { type : String, default : "agregator" },
    status : { type : Boolean, default : true },
    revenuType : { type : String, default : "" },
    percent : { type : Number, default : 0 },
    money : { type : Number, default : "" },
    currency : { type : String, default : "" },
    gameType : { type: Schema.Types.ObjectId, ref: "game_types" }
});

exports.Providers = mongoose.model('providers', ProvidersSchema);
