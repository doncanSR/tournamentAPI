"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.catFaseSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    }
});
//# sourceMappingURL=cat-fase-model.js.map