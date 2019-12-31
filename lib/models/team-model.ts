import { Schema, ObjectId } from 'mongoose';

export const teamSchema = new Schema({
    id: {
        type: ObjectId
    },
    name: {
        type: String
    },
    playersNo: {
        type: Number
    },
    coachId: {
        type: ObjectId
    },
    from: {
        type: String
    },
    points: {
        type: Number
    },
    pointsClass: {
        type: Number
    },
    pointsTotal: {
        type: Number
    },
    sets: {
        type: Number
    },
    tournamentId: {
        type: ObjectId,
        required: [true, 'TournamentId is needed']
    }
    //Arrego de torneos
})