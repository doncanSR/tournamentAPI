
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const refereeSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    firstName: {
        type: String
    },
    association: {
        type: String
    },
    tournamentID: {
        type: String,
        required: [true, 'TournamentId is needed']
    }
})