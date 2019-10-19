
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

  /**
   * getSchedule
   */
  public getSchedule(req: Request, res: Response) {
    Match.aggregate([
      {
        $lookup: {
          from: "teams",
          localField: "teamOne",
          foreignField: "_id",
          as: "team_one"
        }
      },
      {
        $lookup: {
          from: "teams",
          localField: "teamTwo",
          foreignField: "_id",
          as: "team_two"
        }
      }
    ]).sort({ dateMatch: 1 }).exec((err, matches) => {
      if (err) {
        res.send(err);
      }
      let weekday = new Array();
      weekday[0] = "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";

      let schedules = matches.map(match => {
        return {
          MatchId: match._id.toString(),
          Date: weekday[match.dateMatch.getUTCDay()],
          Time: match.dateMatch.getHours() + ':' + match.dateMatch.getMinutes() + ':' + match.dateMatch.getSeconds(),
          Court: match.court,
          TeamOne: match.team_one[0].name,
          TeamTwo: match.team_two[0].name
        }
      });
      res.status(200).json(schedules);
    })
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