"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.groupSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    nameGroup: {
        type: String
    },
    teamID: {
        type: [String]
    }
});
//# sourceMappingURL=group-model.js.map