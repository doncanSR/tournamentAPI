
import * as mongoose from 'mongoose';
import { capturistSchema } from '../models/capturist-model';
import { Request, Response } from 'express';

const Capturist = mongoose.model('Capturist', capturistSchema);

export class CapturistController {
  /**
  * addNewTeam    */
  public addNewCapturist(req: Request, res: Response) {
    let newCapturist = new Capturist(req.body);

    newCapturist.save((err, capturist) => {
      if (err) {
        res.send(err);
      }
      res.json(capturist);
    })
  }
  /**
   * getTeam  */
  public getCapturist(req: Request, res: Response) {
    Capturist.find({}, (err, capturist) => {
      if (err) {

      }
      res.json(capturist);
    })
  }

  /**
   * getCapturistWithId
   */
  public getCapturistWithId(req: Request, res: Response) {
    Capturist.findById(req.params.capturistId, (err, capturist) => {
      if (err) {
        res.send(err);
      }
      res.json(capturist);
    })
  }

  public updateCapturist(req: Request, res: Response) {
    Capturist.findOneAndUpdate({ _id: req.params.capturistId }, req.body, { new: true }, (err, capturist) => {
      if (err) {
        res.send(err);
      }
      res.json(capturist);
    });
  }

  public deleteCapturist(req: Request, res: Response) {
    Capturist.remove({ _id: req.params.capturistId }, (err, capturist) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Successfully deleted capturist!' });
    });
  }
}