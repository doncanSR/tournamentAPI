
import { Schema, ObjectId } from 'mongoose';

export const rolSchema = new Schema({
  id: {
    type: ObjectId
  },
  name: {
    type: String
  },
  password: {
    type: String
  },
  firstName: {
    type: String
  },
  secondName: {
    type: String
  },
  rol: {
    type: String
  },
  email: {
    type: String
  },
  dateStarSession: {
    type: Date
  },
  dateEndSession: {
    type: Date
  },
  tournamentId: {
    type: ObjectId,
    required: [true, 'TournamentId is needed']
  }
});