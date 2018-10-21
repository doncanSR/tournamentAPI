"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.capturistSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String
    },
    dateStartSession: {
        type: Date
    },
    dateEndSession: {
        type: Date
    }
});
//# sourceMappingURL=capturist-model.js.map