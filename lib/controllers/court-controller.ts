
import { model } from 'mongoose';
import { courtSchema } from '../models/court-model';
import { Request, Response } from 'express';

const Court = model('Court', courtSchema);

export class CourtController {
  /**
  * addNewTeam    */
  public addNewCourt(req: Request, res: Response) {
    let newCourt = new Court(req.body);

    newCourt.save((err, phase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(phase);
    })
  }
  /**
   * getTeam  */
  public getCourt(req: Request, res: Response) {
    Court.find({}, (err, court) => {
      if (err) {

      }
      res.status(200).json(court);
    })
  }

  /**
   * getPhaseWithId
   */
  public getCourtWithId(req: Request, res: Response) {
    Court.findById(req.params.courtId, (err, court) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(court);
    })
  }

  public updateCourt(req: Request, res: Response) {
    Court.findOneAndUpdate({ _id: req.query.courtId }, req.body, { new: true }, (err, court) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(court);
    });
  }

  public deleteCourt(req: Request, res: Response) {
    Court.remove({ _id: req.params.courtId }, (err, court) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: 'Successfully deleted court!' });
    });
  }
}