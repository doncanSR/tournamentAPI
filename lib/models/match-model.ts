
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const matchSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    teamOne: {
        type: Schema.Types.ObjectId
    },
    teamTwo: {
        type: Schema.Types.ObjectId
    },
    faseID: {
        type: String
    },
    court: {
        type: Schema.Types.ObjectId
    },
    dateMatch: {
        type: Date
    },
    pointTOne: {
        type: Number
    },
    pointTTwo: {
        type: Number
    },
    groupName: {
        type: String
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
        type: String,
        required: [true, 'TournamentId is needed']
    }
});