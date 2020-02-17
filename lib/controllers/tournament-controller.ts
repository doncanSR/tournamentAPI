import { model, Types } from 'mongoose';
import { tournamentSchema } from '../models/tournament-model';
import { Request, Response } from 'express';
import { CreateSchedule } from "../utils/create-schedules";
import { ScheduleInterface } from "../utils/interfaces/schedule-interface";
import { teamSchema } from '../models/team-model';
import { Schedulefill } from "../utils/schedules-fill";
import { Schedules } from "../utils/schedules";
import * as constants from "../utils/tournamentConstants";

const Team = model('Team', teamSchema);
const Tournament = model('Tournament', tournamentSchema);

export class TournamentController {
  public addNewTournament(req: Request, res: Response) {
    let newTournament = new Tournament(req.body);

    newTournament.save((err, tournament) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(tournament);
    });
  }

  public getTournament(req: Request, res: Response) {
    Tournament.find({}, (err, tournaments) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(tournaments);
    });
  }

  public getTournamentWithID(req: Request, res: Response) {
    Tournament.findById(req.params.tournamentId, (err, tournament) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(tournament);
    });
  }

  public updateTournament(req: Request, res: Response) {
    Tournament.findOneAndUpdate({ _id: req.query.tournamentId }, req.body, { new: true }, (err, tournament) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(tournament);
    });
  }

  public deleteTournament(req: Request, res: Response) {
    Tournament.remove({ _id: req.params.tournamentId }, (err, tournament) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: 'Successfully deleted tournament!' });
    });
  }

  /**
   * getTournamnetTime
req: Request, res:Response   */
  public getTournamentTime(req: Request, res:Response) {
    Tournament.find({_id: Types.ObjectId(req.params.tournamentId)}, {starDate: 1, EndDate: 1}, (err, tournament) => {
      if(err){ res.status(404).json(err)};
      res.status(200).json(tournament);
    });
  }

  public async initGroups(req: Request, res:Response){
    let numberTeams = await Team.count({tournamentId: req.body.tournamentId},(err, count)=>{
      if(err){ res.status(constants.ERROR_NOT_FOUND).json(err)};
      return count;
    });
    let schedule:ScheduleInterface = new CreateSchedule(numberTeams, req.body.tournamentId);
    let isCorrect: boolean = schedule.verifyTeams();
    let fillSchedules = new Schedulefill(schedule);
    if (isCorrect) {
      await fillSchedules.fill();
      res.status(constants.STATUS_OK).json({message: constants.SUCCESSFUL_OPERATION});
    }else{
      res.status(constants.ERROR_INTERNAL_SERVER).json({message: constants.ERROR_ENOUGH_TIME});
    }

  }

  public async doTheRole(req: Request, res:Response){

    let schedules = new Schedules(req.body.tournamentId);
    await schedules.scheduleInit();
    res.status(constants.STATUS_OK).json({message: constants.SUCCESSFUL_OPERATION});

  }

  public async initTournament(req: Request, res:Response){

    let numberTeams = await Team.count({tournamentId: req.body.tournamentId},(err, count)=>{
      if(err){ res.status(constants.ERROR_NOT_FOUND).json(err)};
      return count;
    });

    let schedule:ScheduleInterface = new CreateSchedule(numberTeams, req.body.tournamentId);
    let isCorrect: boolean = schedule.verifyTeams();
    let fillSchedules = new Schedulefill(schedule);

    if (isCorrect) {
      await fillSchedules.fill();
      let schedules = new Schedules(req.body.tournamentId);
      await schedules.scheduleInit();
      res.status(constants.STATUS_OK).json({message: constants.SUCCESSFUL_OPERATION});
    }else{
      res.status(constants.ERROR_INTERNAL_SERVER).json({message: constants.ERROR_ENOUGH_TIME});
    }
    
  }


}