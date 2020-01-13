import { model, ObjectId } from 'mongoose';
import { matchSchema } from '../models/match-model';
import { Request, Response } from 'express';
import { AddPoints } from "../utils/addPoints"

const Match = model('Match', matchSchema);

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
      },
      {
        $lookup: {
          from: "courts",
          localField: "court",
          foreignField: "_id",
          as: "court_data"
        }
      }
    ]).sort({ dateMatch: 1 }).exec((err, matches) => {
      if (err) {
        res.send(err);
      }

      let schedules = matches.map(match => {
        return {
          matchId: match._id,
          date: match.dateMatch,
          teamOne: match.team_one[0].name,
          teamTwo: match.team_two[0].name,
          court: match.court_data[0].name
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

  public async registerMatch(req: Request, res: Response) {

    let addPoints = new AddPoints(new ObjectId(req.body.tournamentId));
    let added = await addPoints.wasAdded(req.body);
    console.log(added);
    res.status(added.status).json(added.message);
  }

  public async getListOfBestTeams(req: Request, res: Response) {

    let addPoints = new AddPoints(new ObjectId(req.query.tournamentId));
    let list = await addPoints.getList()
    
    res.json(list);

  }

}