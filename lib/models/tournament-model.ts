
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const tournmanetSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String,
        required: 'Enter tournament name'
    },
    starDate: {
        type: Date,
         required: 'Enter starDate'
    },
    EndDate: {
        type: Date,
         required: 'Enter EndDate '
    },
    state: {
        type: String,
         required: 'Enter state '
    },
    city: {
        type: String,
         required: 'Enter city '
    },
    headquarters: {
        type: String,
         required: 'Enter headquarters '
    },
    courts: {
        type: String,
         required: 'Enter courts '
    },
    hoursPerDay: {
        type: Number,
         required: 'Enter hoursPerDay '
    },
});