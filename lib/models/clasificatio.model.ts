
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const clasificationSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId
  },
  groupsId: {
    type: [String]
  }, 
  level: {
    type: Number
  }
});