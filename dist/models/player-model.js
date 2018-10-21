"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.playerSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    firstName: {
        type: String
    },
    secondName: {
        type: String
    },
    number: {
        type: Number
    },
    birthday: {
        type: Number
    },
    teamID: {
        type: String
    }
});
//# sourceMappingURL=player-model.js.map