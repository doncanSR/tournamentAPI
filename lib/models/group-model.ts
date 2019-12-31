import { Schema, ObjectId } from 'mongoose';

export const groupSchema = new Schema({
    id: {
        type: ObjectId
    },
    nameGroup: {
        type: String
    },
    teamsId: {
        type: [ObjectId]
    },
    tournamentId: {
        type: ObjectId,
        required: [true, 'TournamentId is needed']
    }
});