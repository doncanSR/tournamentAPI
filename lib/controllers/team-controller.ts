
import * as mongoose from 'mongoose';
import { teamSchema } from '../models/team-model';
import { Request, Response } from 'express';

const Team = mongoose.model('Team', teamSchema);

export class TeamController {
    public addNewTeam(req: Request, res: Response){
        let newTeam = new Team(req.body);

        
    }
}