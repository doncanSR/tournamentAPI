import { Schema, ObjectId } from 'mongoose';

export const courtSchema = new Schema({
  id: {
    type: ObjectId
  },
  name: {
    type: String
  },
  availability: {
    type: Number
  },
  coordinates: {
    type: String
  },
  dayHours: {
    type: [String]
  },
  tournamentId: {
    type: ObjectId,
    required: [true, 'TournamentId is needed']
  }
});