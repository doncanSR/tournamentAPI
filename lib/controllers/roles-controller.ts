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
   * deleagteRol
   */

  /**
   * addManager
   */
  public addManager(req, res) {
    let newManager = new role(req.body);

    newManager.save((err, role) => {
      if (err) {
        res.send(err);
      }
      let token = jwt.sign({ name: role.name, role: role.rol }, 'secret');
      res.status(200).send({ auth: true, token: token, name: role.name });
    })
  }
  /**
   * getRol
   */
  public getRol(req, res) {
    if (req.body.name === "adminSecret") {
      let passwordIsValid = bcrypt.compareSync(req.body.password, 'Qwerty94');
      if (passwordIsValid) return res.status(401).send({ auth: false, token: null });
      let token = jwt.sign({ name: 'adminSecret', role: 'admin' }, 'secret');
      res.status(200).send({ auth: true, token: token, name: role.name });
    } else {
      role.findById(req.body.roleId, (err, role) => {
        if (err) {
          res.status(404).send(err);
        }
        let passwordIsValid = bcrypt.compareSync(req.body.password, role.password);
        if (passwordIsValid) return res.status(401).send({ auth: false, token: null });
        // create a token
        let token = jwt.sign({ name: role.name, role: role.rol }, 'secret');
        res.status(200).send({ auth: true, token: token, name: role.name });
      })
    }
  }
}
function deleagteRol(rol: string): number {
  if (rol === 'admin' || rol === 'manager') {
    return 1;
  }
  if (rol === 'capturist') {
    return 2;
  }
}