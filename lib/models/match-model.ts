
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
    dateMatch: {
        type: Date
    },
    hourMatch: {
        type: String
    },
    pointTeamOne: {
        type: Number
    },
    pointTeamTwo: {
        type: Number
    },
    setsTeamOne: {
        type: Number
    },
    setsTeamTwo: {
        type: Number
    }, 
    refereeId: {
        type: String
    },
    tournamentID: {
        type: String
    }
});