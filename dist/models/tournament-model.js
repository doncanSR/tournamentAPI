"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.tournmanetSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String,
        required: 'Enter a last name'
    },
    starDate: {
        type: Date
    },
    EndDate: {
        type: Date
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    headquarters: {
        type: String
    }
});
//# sourceMappingURL=tournament-model.js.map