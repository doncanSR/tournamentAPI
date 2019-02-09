import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export class VerifyToken {
  /**
   * check
   */
  public check(req, res, next) {
    let token = req.headers['x-access-token'];
    if (!token)
      return res.status(404).send({ error: {code: '404', message:'token not found'}});
    jwt.verify(token, 'secret', function (err, decoded) {
      if (err)
        return res.status(401).send({ error: {code: '401', message:'token not found'}});
      // if everything good, save to request for use in other routes
      req.name = decoded.name;
      req.rol = decoded.role;
      next();
    });
  }
}