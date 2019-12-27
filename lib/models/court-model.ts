import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;


export const courtSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId
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
    type: Schema.Types.ObjectId,
    required: [true, 'TournamentId is needed']
  }
});