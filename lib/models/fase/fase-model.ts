import { Schema, ObjectId } from 'mongoose';

export const faseSchema = new Schema({
    id: {
        type: ObjectId
    },
    teamsId: {
        type: [ObjectId]
    },
    catFaseId:{
        type: ObjectId
    }, 
    tournamentId: {
        type: ObjectId,
        required: [true, 'TournamentId is needed']
    }
});