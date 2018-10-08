
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const faseSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    teamID: {
        type: String
    }
});