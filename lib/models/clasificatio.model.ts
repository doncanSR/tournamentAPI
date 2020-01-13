import { Schema, ObjectId } from 'mongoose';

export const clasificationSchema = new Schema({
  id: {
    type: ObjectId
  },
  groupsId: {
    type: [ObjectId]
  },
  level: {
    type: Number
  },
  tournamentId: {
    type: ObjectId,
    required: [true, 'TournamentId is needed']
  }
});