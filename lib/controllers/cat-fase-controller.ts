
import * as mongoose from 'mongoose';
import { catFaseSchema } from '../models/fase/cat-fase-model';
import { Request, Response } from 'express';

const CatFase = mongoose.model('CatFase', catFaseSchema);

export class CatFaseController {
  /**
  * addNewTeam    */
  public addNewCatFase(req: Request, res: Response) {
    let newCatFase = new CatFase(req.body);

    newCatFase.save((err, catFase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(catFase);
    })
  }
  /**
   * getTeam  */
  public getCatFase(req: Request, res: Response) {
    CatFase.find({}, (err, catFase) => {
      if (err) {

      }
      res.status(200).json(catFase);
    })
  }

  /**
   * getCatFaseWithId
   */
  public getCatFaseWithId(req: Request, res: Response) {
    CatFase.findById(req.params.catFaseId, (err, catFase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(catFase);
    })
  }

  public updateCatFase(req: Request, res: Response) {
    CatFase.findOneAndUpdate({ _id: req.query.catFaseId }, req.body, { new: true }, (err, catFase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(catFase);
    });
  }

  public deleteCatFase(req: Request, res: Response) {
    CatFase.remove({ _id: req.params.catFaseId }, (err, catFase) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: 'Successfully deleted catFase!' });
    });
  }
}