import { model, Types } from 'mongoose';
import { phaseSchema } from '../models/phase/phase-model';
import { Request, Response } from 'express';
import { matchSchema } from '../models/match-model';
import * as constants from "../utils/tournamentConstants";
import { AddPoints } from '../utils/addPoints';
import { teamSchema } from '../models/team-model';

const Phase = model('Phase', phaseSchema);
const Match = model('Match', matchSchema)
const Team = model('Team', teamSchema)

export class PhaseController {
  /**
  * addNewTeam    */
  public addNewPhase(req: Request, res: Response) {
    let newPhase = new Phase(req.body);

    newPhase.save((err, phase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(phase);
    })
  }
  /**
   * getTeam  */
  public getPhase(req: Request, res: Response) {
    Phase.find({}, (err, phase) => {
      if (err) {

      }
      res.status(200).json(phase);
    })
  }

  /**
   * getPhaseWithId
   */
  public getPhaseWithId(req: Request, res: Response) {
    Phase.findById(req.params.phaseId, (err, phase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(phase);
    })
  }

  public updatePhase(req: Request, res: Response) {
    Phase.findOneAndUpdate({ _id: req.query.phaseId }, req.body, { new: true }, (err, phase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(phase);
    });
  }

  public deletePhase(req: Request, res: Response) {
    Phase.remove({ _id: req.params.phaseId }, (err, phase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: 'Successfully deleted phase!' });
    });
  }

  public async finishGroupsPhase(req: Request, res: Response) {

    Match.find({tournamentId: req.body.tournamentId, phaseId: constants.GROUPS_PHASE_ID}, (err, matches) => {
      if (err) {
        res.send(err);
      }
      //Validate if all the matches have been done
      matches.forEach(match => {
        if(!match.pointsTeamOne || !match.pointsTeamTwo || !match.refereeId || 
           !match.setsTeamOne || !match.setsTeamTwo){
            res.status(503).json({message: constants.ERROR_INCOMPLETE_PHASE})
            return;
        }
      });
    });

    let addPoints = new AddPoints(Types.ObjectId(req.body.tournamentId));

    // if(addPoints.finishGroupPhase()){
    //   res.send();
    // }

    res.send();

  }
}