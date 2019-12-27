
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
    faseId: {
        type: Schema.Types.ObjectId
    },
    court: {
        type: Schema.Types.ObjectId
    },
    dateMatch: {
        type: Date
    },
    pointsTeamOne: {
        type: Number
    },
    pointsTeamTwo: {
        type: Number
    },
    groupId: {
        type: Schema.Types.ObjectId
    },
    setsTeamOne: {
        type: Number
    },
    setsTeamTwo: {
        type: Number
    },
    refereeId: {
        type: Schema.Types.ObjectId
    },
    tournamentId: {
        type: Schema.Types.ObjectId,
        required: [true, 'TournamentId is needed']
    }
});