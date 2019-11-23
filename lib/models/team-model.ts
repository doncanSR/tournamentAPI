
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const teamSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    playersNo: {
        type: Number
    },
    coachId: {
        type: String
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
        type: String,
        required: [true, 'TournamentId is needed']
    }
    //Arrego de torneos
})