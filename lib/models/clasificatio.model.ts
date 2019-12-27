
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const clasificationSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId
  },
  groupsId: {
    type: [Schema.Types.ObjectId]
  },
  level: {
    type: Number
  },
  tournamentId: {
    type: Schema.Types.ObjectId,
    required: [true, 'TournamentId is needed']
  }
});