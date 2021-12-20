var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GamesSchema = new Schema({
    id: { type: String, unique: true, required: true },
    order: { type: Number, required : true, default : 0 },
    provider : { type: Schema.Types.ObjectId, ref: "providers" },
    gameType : { type: Schema.Types.ObjectId, ref: "game_types" },
    gameId: { type: String, required : true  },
    gameName: { type: String, default : "" },
    image : { type: String, default : "" },
    status: { type: Boolean, default : true },
    detail : { type : Object, default : {}},
    LAUNCHURLID : { type: Number, required : true }
});

const GameTypesSchema = new Schema({
    id: { type: String, unique: true, required: true },
    order: { type: Number, required: true },
    name: { type: String, required: true, unique: true },
    icon: { type: String, default: ""},
    status: { type: Boolean, default: true },
});

exports.Games = mongoose.model('games', GamesSchema);
exports.GameTypes = mongoose.model('game_types', GameTypesSchema);