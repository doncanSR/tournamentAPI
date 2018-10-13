import * as mongoose from 'mongoose';
import { tournmanetSchema } from '../models/tournament-model';
import { Request, Response } from 'express';

const Tournament = mongoose.model('Tournament', tournmanetSchema);

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
    Tournament.findOneAndUpdate({ _id: req.params.tournamentId }, req.body, { new: true }, (err, tournament) => {
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
}