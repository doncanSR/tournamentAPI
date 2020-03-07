
import { model } from 'mongoose';
import { catPhaseSchema } from '../models/phase/cat-phase-model';
import { Request, Response } from 'express';

const CatPhase = model('CatPhase', catPhaseSchema);

export class CatPhaseController {
  /**
  * addNewTeam    */
  public addNewCatPhase(req: Request, res: Response) {
    let newCatPhase = new CatPhase(req.body);

    newCatPhase.save((err, catPhase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(catPhase);
    })
  }
  /**
   * getTeam  */
  public getCatPhase(req: Request, res: Response) {
    CatPhase.find({}, (err, catPhase) => {
      if (err) {

      }
      res.status(200).json(catPhase);
    })
  }

  /**
   * getCatPhaseWithId
   */
  public getCatPhaseWithId(req: Request, res: Response) {
    CatPhase.findById(req.params.catPhaseId, (err, catPhase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(catPhase);
    })
  }

  public updateCatPhase(req: Request, res: Response) {
    CatPhase.findOneAndUpdate({ _id: req.query.catPhaseId }, req.body, { new: true }, (err, catPhase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(catPhase);
    });
  }

  public deleteCatPhase(req: Request, res: Response) {
    CatPhase.remove({ _id: req.params.catPhaseId }, (err, catPhase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: 'Successfully deleted catPhase!' });
    });
  }
}