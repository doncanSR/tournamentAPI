
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const tournamentSchema = new Schema({
    name: {
        type: String,
        required: 'Enter tournament name'
    },
    startDate: {
        type: Date,
         required: 'Enter startDate'
    },
    endDate: {
        type: Date,
         required: 'Enter endDate '
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
    matchTime: {
        type: Number,
        required: 'Enter matchType'
    },
});