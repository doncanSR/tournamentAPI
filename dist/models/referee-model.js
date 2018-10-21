"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.refereeSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    firstName: {
        type: String
    },
    association: {
        type: String
    }
});
//# sourceMappingURL=referee-model.js.map