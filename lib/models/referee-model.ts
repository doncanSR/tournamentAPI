import { Schema, ObjectId } from 'mongoose';

export const refereeSchema = new Schema({
    id: {
        type: ObjectId
    },
    name: {
        type: String
    },
    firstName: {
        type: String
    },
    association: {
        type: String
    },
    tournamentId: {
        type: ObjectId,
        required: [true, 'TournamentId is needed']
    }
})