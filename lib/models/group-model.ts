
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const groupSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    nameGroup: {
        type: String
    },
    teamID: {
        type: [String]
    }, 
    tournamentID: {
        type: String,
        required: [true, 'TournamentId is needed']
    }
});