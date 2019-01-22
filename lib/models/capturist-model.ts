
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const capturistSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    password: {
        type: String
    },
    role:{
        type: String
    },
    email:{
        type:String
    },
    dateStartSession: {
        type: Date
    },
    dateEndSession: {
        type: Date
    }
})