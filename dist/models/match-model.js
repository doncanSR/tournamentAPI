"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.matchSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    teamOne: {
        type: String
    },
    teamTwo: {
        type: String
    },
    refereeName: {
        type: String
    },
    faseID: {
        type: String
    },
    dateMatch: {
        type: Date
    },
    hourMatch: {
        type: String
    },
    pointTeamOne: {
        type: Number
    },
    pointTeamTwo: {
        type: Number
    },
    setsTeamOne: {
        type: Number
    },
    setsTeamTwo: {
        type: Number
    },
    refereeId: {
        type: String
    }
});
//# sourceMappingURL=match-model.js.map