
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const tournmanetSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String,
        required: 'Enter a last name'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    headquarters: {
        type: String
    }
});