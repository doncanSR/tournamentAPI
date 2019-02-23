
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const playerSchema = new Schema({
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
        type: Date
    },
    teamID:{
        type: String
    },
    tournamentID: {
        type: String
    }
});