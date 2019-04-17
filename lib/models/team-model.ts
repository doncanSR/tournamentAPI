
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
    tournamentID: {
        type: String
    }
    //Arrego de torneos
})