
import * as mongoose from 'mongoose';
import { teamSchema } from '../models/team-model';
import { Request, Response } from 'express';

const Team = mongoose.model('Team', teamSchema);

export class TeamController {
  /**
  * addNewTeam    */
  public addNewTeam(req: Request, res: Response) {
    let newTeam = new Team(req.body);

    newTeam.save((err, team) => {
      if (err) {
        res.send(err);
      }
      res.json(team);
    })
  }
  /**
   * getTeam  */
  public getTeam(req: Request, res: Response) {
    Team.find({}, (err, teams) => {
      if (err) {

      }
      res.json(teams);
    })
  }

  /**
   * getTornamentWithId
   */
  public getTornamentWithId(req: Request, res: Response) {
    Team.findById(req.params.teamId, (err, team) => {
      if (err) {
        res.send(err);
      }
      res.json(team);
    })
  }

  public updateTeam(req: Request, res: Response) {
    Team.findOneAndUpdate({ _id: req.params.teamId }, req.body, { new: true }, (err, team) => {
      if (err) {
        res.send(err);
      }
      res.json(team);
    });
  }

  public deleteTeam(req: Request, res: Response) {
    Team.remove({ _id: req.params.teamId }, (err, team) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Successfully deleted Team!' });
    });
  }
}