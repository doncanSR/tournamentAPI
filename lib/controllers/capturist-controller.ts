
import * as mongoose from 'mongoose';
import { capturistSchema } from '../models/capturist-model';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

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
      res.status(200).json(capturist);
    })
  }
  /**
   * getTeam  */
  public getCapturist(req: Request, res: Response) {
    Capturist.find({}, (err, capturist) => {
      if (err) {

      }
      res.status(200).json(capturist);
    })
  }

  /**
   * getCapturistWithId
   */
  public getCapturistWithId(req: Request, res: Response) {
    Capturist.findById(req.body.capturistId, (err, capturist) => {
      if (err) {
        res.status(404).send(err);
      }
      let passwordIsValid = bcrypt.compareSync(req.body.password, capturist.password);
      if (passwordIsValid) return res.status(401).send({ auth: false, token: null });
      // create a token
      let token = jwt.sign({name: capturist.name, role: capturist.role}, 'secret');
      res.status(200).send({ auth: true, token: token, name: capturist.name });
    })
  }

  public updateCapturist(req: Request, res: Response) {
    Capturist.findOneAndUpdate({ _id: req.params.capturistId }, req.body, { new: true }, (err, capturist) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(capturist);
    });
  }

  public deleteCapturist(req: Request, res: Response) {
    Capturist.remove({ _id: req.params.capturistId }, (err, capturist) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: 'Successfully deleted capturist!' });
    });
  }
}