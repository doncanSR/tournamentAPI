import { Schema, ObjectId } from 'mongoose';

export const catFaseSchema = new Schema({
    id: {
        type: ObjectId
    },
    name: {
        type: String
    }
});