import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { rolSchema } from "../models/role-model";


const role = mongoose.model('role', rolSchema);

export class Roles {

  /**
   * levelOne */
  public levelOne(req, res, next) {
    if (req.name && req.rol) {
      let level: number = deleagteRol(req.rol);
      if (level === 1) {
        next();
      } else {
        return res.status(405).send({ auth: false, message: 'This user is not allowed.' });
      }
    }
  }
  /**
   * levelTwo */
  public levelTwo(req, res, next) {
    if (req.name && req.rol) {
      let level: number = deleagteRol(req.rol);
      if (level === 2 || level === 1) {
        next();
      } else {
        return res.status(405).send({ auth: false, message: 'This user is not allowed.' });
      }
    }
  }
  public levelThree(req, res, next) {
    if (req.name && req.rol) {
      let level: number = deleagteRol(req.rol);
      if (level === 2 || level === 1 || level === 3) {
        next();
      } else {
        return res.status(405).send({ auth: false, message: 'This user is not allowed.' });
      }
    }
  }
  /**
   * adminLevel
   */
  public adminLevel(req, res, next) {
    if (req.name && req.rol) {
      let level = deleagteRol(req.rol);
      if (level === 1) {
        next();
      } else {
        return res.status(405).send({ auth: false, message: 'This user is not allowed.' });
      }
    }
  }
  /**
   * addUser
   */
  public addUser(req, res) {
    let newUser = new role(req.body);
    newUser.save((err, role) => {
      if (err) {
        res.send(err);
      }
      // create a token
      res.status(200).send({ newUser });
    })
  }

  /**
   * createCoach
   */
  public createCoach(req, res) {
    let newCoach = new role(req.body);
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
   * logIn
   */
  public logIn(req, res) {
    const date = new Date();
    let user = {
      dateStarSession: date
    }
    role.findOneAndUpdate({ 'email': req.body.email }, user, { new: true }, (err, user) => {
      if (err || !user) {
        res.status(404).send({ error: {code: '404', message:'user not found'}});
      }
      let passwordIsValid = (req.body.password === user.password) ? true : false;
      if (!passwordIsValid) return res.status(401).send({ error: {code: '403', message:'Invalid password'}});
      // create a token
      let token = jwt.sign({ name: user._id, role: user.rol }, 'secret');
      switch (user.rol) {
        case 'admin':
          res.status(200).send({ auth: true, token: token });
          break;
        case 'capturist':
          res.status(200).send({ auth: true, token: token, tournament: user.tournamentId });
          break;
        case 'manager':
          res.status(200).send({ auth: true, token: token, tournament: user.tournamentId });
          break;
        case 'coach':
          res.status(200).send({ auth: true, token: token, name: user._id, tournament: user.tournamentId });
          break;
        default:
          res.status(404).send({ error: {code: '404', message:'user not found'}});
          break;
      }
    });
  }

  /**
   * updateUser
   */
  public updateUser(req, res) {
    role.findOneAndUpdate({ 'email': req.body.email }, req.body, { new: true }, (err, user) => {
      if (err) {
        res.status(404).send({ error: {code: '404', message:'user not found'}});
      }
      res.status(200).json(user);
    });
  }

  /**
   * deleteUser
   */
  public deleteUser(req, res) {
    role.remove({ 'email': req.body.email }, (err, user) => {
      if (err) {
        res.status(404).send({ error: {code: '404', message:'user not found'}});
      }
      res.status(200).json({ message: 'Successfully deleted coach!' });
    });
  }

  /**
   * logOut
   */
  public logOut(req, res) {
    const date = new Date();
    let cap = {
      dateEndSession: date
    }
    role.findOneAndUpdate({ _id: req.name }, cap, { new: true }, (err, user) => {
      if (err) {
        res.status(404).send({ error: {code: '404', message:'user not found'}});
      }
      res.status(200).json('Logout success!');
    });
  }

  /**
   * getCoaches
   */
  public getCoaches(req, res) {
    role.find({ 'rol': 'coach' }, (err, coches) => {
      if (err) {
        res.status(404).send({ error: {code: '404', message:'coaches not found'}});
      }
      res.status(200).json(coches);
    })
  }
  /**
 * getManagers
 */
  public getManagers(req, res) {
    role.find({ 'rol': 'manager' }, (err, managers) => {
      if (err) {
        res.status(404).send({ error: {code: '404', message:'manager not found'}});
      }
      res.status(200).json(managers);
    })
  }

  /**
 * getCapturist
 */
  public getCapturist(req, res) {
    role.find({ 'rol': 'capturist' }, (err, capturists) => {
      if (err) {
        res.status(404).send({ error: {code: '404', message:'capturist not found'}});
      }
      res.status(200).json(capturists);
    })
  }

}
/**
  * deleagteRol
  */
function deleagteRol(rol: string): number {
  if (rol === 'admin' || rol === 'manager') {
    return 1;
  }
  if (rol === 'capturist') {
    return 2;
  }
  if (rol === 'coach') {
    return 3;
  }
}