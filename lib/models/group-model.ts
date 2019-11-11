
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const groupSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    nameGroup: {
        type: String
    },
    teamsId: {
        type: [String]
    },
    tournamentId: {
        type: String,
        required: [true, 'TournamentId is needed']
    }
});