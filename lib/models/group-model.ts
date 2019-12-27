
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
        type: [Schema.Types.ObjectId]
    },
    tournamentId: {
        type: Schema.Types.ObjectId,
        required: [true, 'TournamentId is needed']
    }
});