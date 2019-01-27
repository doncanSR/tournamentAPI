
import * as mongoose from 'mongoose';
import { coachSchema } from '../models/coach-model';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

const coach = mongoose.model('coach', coachSchema);

export class CoachController {
  /**
  * addNewTeam    */
  public addNewCoach(req: Request, res: Response) {
    let newCoach = new coach(req.body);

    newCoach.save((err, coach) => {
      if (err) {
        res.status(404).send(err);
      }
      // create a token
      let token = jwt.sign({ name: coach.name, role: coach.role }, 'secret');
      res.status(200).send({ auth: true, token: token, name: coach.id });
    })
  }
  /**
   * getTeam  */
  public getCoach(req: Request, res: Response) {
    coach.find({}, (err, coach) => {
      if (err) {

      }
      res.status(200).json(coach);
    })
  }

  /**
   * getcoachWithId
   */
  public getCoachWithId(req: Request, res: Response) {

    coach.findOne({ 'email': req.body.email }, (err, coach) => {
      if (err) {
        res.status(404).send(err);
      }
      let passwordIsValid = bcrypt.compareSync(req.body.password, coach.password);
      if (passwordIsValid) return res.status(401).send({ auth: false, token: null });
      // create a token
      let token = jwt.sign({ name: coach.name, role: coach.role }, 'secret');
      res.status(200).send({ auth: true, token: token, name: coach.name });
    })
  }

  public updateCoach(req: Request, res: Response) {
    coach.findOneAndUpdate({ _id: req.params.coachId }, req.body, { new: true }, (err, coach) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(coach);
    });
  }

  public deleteCoach(req: Request, res: Response) {
    coach.remove({ _id: req.params.coachId }, (err, coach) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: 'Successfully deleted coach!' });
    });
  }
}