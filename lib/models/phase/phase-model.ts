import { Schema, ObjectId } from 'mongoose';

export const phaseSchema = new Schema({
    id: {
        type: ObjectId
    },
    teamsId: {
        type: [ObjectId]
    },
    catPhaseId:{
        type: ObjectId
    }, 
    tournamentId: {
        type: ObjectId,
        required: [true, 'TournamentId is needed']
    }
});