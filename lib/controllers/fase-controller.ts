import { model } from 'mongoose';
import { faseSchema } from '../models/fase/fase-model';
import { Request, Response } from 'express';

const Fase = model('Fase', faseSchema);

export class FaseController {
  /**
  * addNewTeam    */
  public addNewFase(req: Request, res: Response) {
    let newFase = new Fase(req.body);

    newFase.save((err, fase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(fase);
    })
  }
  /**
   * getTeam  */
  public getFase(req: Request, res: Response) {
    Fase.find({}, (err, fase) => {
      if (err) {

      }
      res.status(200).json(fase);
    })
  }

  /**
   * getFaseWithId
   */
  public getFaseWithId(req: Request, res: Response) {
    Fase.findById(req.params.faseId, (err, fase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(fase);
    })
  }

  public updateFase(req: Request, res: Response) {
    Fase.findOneAndUpdate({ _id: req.query.faseId }, req.body, { new: true }, (err, fase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(fase);
    });
  }

  public deleteFase(req: Request, res: Response) {
    Fase.remove({ _id: req.params.faseId }, (err, fase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: 'Successfully deleted fase!' });
    });
  }
}