
import { model } from 'mongoose';
import { refereeSchema } from '../models/referee-model';
import { Request, Response } from 'express';

const Referee = model('Referee', refereeSchema);

export class RefereeController {
  /**
  * addNewReferee    */
  public addNewReferee(req: Request, res: Response) {
    let newReferee = new Referee(req.body);

    newReferee.save((err, referee) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(referee);
    })
  }
  /**
   * getReferee  */
  public getReferee(req: Request, res: Response) {
    Referee.find({}, (err, referee) => {
      if (err) {

      }
      res.status(200).json(referee);
    })
  }

  /**
   * getRefereeWithId
   */
  public getRefereeWithId(req: Request, res: Response) {
    Referee.findById(req.params.refereeId, (err, referee) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(referee);
    })
  }

  public updateReferee(req: Request, res: Response) {
    Referee.findOneAndUpdate({ _id: req.query.refereeId }, req.body, { new: true }, (err, referee) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(referee);
    });
  }

  public deleteReferee(req: Request, res: Response) {
    Referee.remove({ _id: req.params.refereeId }, (err, referee) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: 'Successfully deleted referee!' });
    });
  }
}