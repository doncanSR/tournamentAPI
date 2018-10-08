
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const catFaseSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    }
});