import { Schema, ObjectId } from 'mongoose';

export const catPhaseSchema = new Schema({
    id: {
        type: ObjectId
    },
    name: {
        type: String
    }
});