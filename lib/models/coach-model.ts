
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const coachSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    password: {
        type: String,
    },
    role: {
        type: String
    },
    firstName: {
        type: String
    },
    secondName: {
        type: String
    },
    association: {
        type: String
    },
    email: {
        type: String
    },
    teamId: {
        type: String
    }
})