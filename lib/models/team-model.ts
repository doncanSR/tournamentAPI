
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
        type: Schema.Types.ObjectId
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
        type: Schema.Types.ObjectId,
        required: [true, 'TournamentId is needed']
    }
    //Arrego de torneos
})