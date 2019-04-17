
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const faseSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    teamId: {
        type: [String]
    },
    catFaseId:{
        type: String
    }, 
    tournamentID: {
        type: String
    }
});