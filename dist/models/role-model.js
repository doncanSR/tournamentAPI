"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.rolSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    password: {
        type: String
    },
    firstName: {
        type: String
    },
    secondName: {
        type: String
    },
    rol: {
        type: String
    }
});
//# sourceMappingURL=role-model.js.map