import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const faseSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    teamsId: {
        type: [String]
    },
    catFaseId:{
        type: String
    }, 
    tournamentId: {
        type: String,
        required: [true, 'TournamentId is needed']
    }
});