import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export class VerifyToken {
  /**
   * check
   */
  public check(req, res, next) {
    let token = req.headers['x-access-token'];
    if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, 'secret', function (err, decoded) {
      if (err)
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      // if everything good, save to request for use in other routes
      req.name = decoded.name;
      req.rol = decoded.role;
      next();
    });
  }
}