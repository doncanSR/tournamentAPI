
import * as mongoose from 'mongoose';
import { matchSchema } from '../models/match-model';
import { Request, Response } from 'express';

const Match = mongoose.model('Match', matchSchema);

export class MatchController {
  /**
  * addNewTeam    */
  public addNewMatch(req: Request, res: Response) {
    let newMatch = new Match(req.body);

    newMatch.save((err, match) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(match);
    })
  }
  /**
   * getTeam  */
  public getMatch(req: Request, res: Response) {
    Match.find({}, (err, match) => {
      if (err) {

      }
      res.status(200).json(match);
    })
  }

  /**
   * getMatchWithId
   */
  public getMatchWithId(req: Request, res: Response) {
    Match.findById(req.params.matchId, (err, match) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(match);
    })
  }

  public updateMatch(req: Request, res: Response) {
    Match.findOneAndUpdate({ _id: req.query.matchId }, req.body, { new: true }, (err, match) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(match);
    });
  }

  public deleteMatch(req: Request, res: Response) {
    Match.remove({ _id: req.params.matchId }, (err, match) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: 'Successfully deleted match!' });
    });
  }
}