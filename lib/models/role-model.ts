
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const rolSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId
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
    type: String
  }
});