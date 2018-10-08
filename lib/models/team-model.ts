
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const teamSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    players: {
        type: Number
    },
    coach: {
        type: String
    },
    from: {
        type: String
    },
    points: {
        type: Number
    }
})