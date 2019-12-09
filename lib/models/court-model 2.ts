import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;


export const CourtSchema = new Schema({
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
  tournamentID: {
    type: String,
    required: [true, 'TournamentId is needed']
  }
});