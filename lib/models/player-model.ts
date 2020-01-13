import { Schema, ObjectId } from 'mongoose';

export const playerSchema = new Schema({
    id: {
        type: ObjectId
    },
    name: {
        type: String
    },
    firstName: {
        type: String
    },
    secondName: {
        type: String
    },
    number: {
        type: Number
    },
    birthday: {
        type: Date
    },
    teamId:{
        type: ObjectId
    },
    tournamentId: {
        type: ObjectId,
        required: [true, 'TournamentId is needed']
    }
});