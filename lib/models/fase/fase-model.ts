import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const faseSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    teamsId: {
        type: [Schema.Types.ObjectId]
    },
    catFaseId:{
        type: Schema.Types.ObjectId
    }, 
    tournamentId: {
        type: Schema.Types.ObjectId,
        required: [true, 'TournamentId is needed']
    }
});