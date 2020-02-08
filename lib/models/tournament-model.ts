import { Schema, ObjectId } from 'mongoose';

export const tournamentSchema = new Schema({
    name: {
        type: String,
        required: 'Enter tournament name'
    },
    starDate: {
        type: Date,
         required: 'Enter startDate'
    },
    EndDate: {
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