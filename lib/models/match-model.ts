
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const matchSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    teamOne: {
        type: String
    },
    teamTwo: {
        type: String
    },
    faseID: {
        type: String
    },
    matchDate: {
        type: Date
    },
    pointTOne: {
        type: Number
    },
    pointTTwo: {
        type: Number
    },
    setTOne: {
        type: Number
    },
    setTTwo: {
        type: Number
    }, 
    refereeId: {
        type: String
    },
    tournamentID: {
        type: String
    }
});