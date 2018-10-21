"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.teamSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    playersNo: {
        type: Number
    },
    coach: {
        type: String
    },
    from: {
        type: String
    },
    points: {
        type: Number
    }
});
//# sourceMappingURL=team-model.js.map