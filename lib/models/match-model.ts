import { Schema, ObjectId } from 'mongoose';

export const matchSchema = new Schema({
    id: {
        type: ObjectId
    },
    teamOne: {
        type: ObjectId
    },
    teamTwo: {
        type: ObjectId
    },
    faseId: {
        type: ObjectId
    },
    court: {
        type: ObjectId
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
        type: ObjectId
    },
    setsTeamOne: {
        type: Number
    },
    setsTeamTwo: {
        type: Number
    },
    refereeId: {
        type: ObjectId
    },
    tournamentId: {
        type: ObjectId,
        required: [true, 'TournamentId is needed']
    }
});