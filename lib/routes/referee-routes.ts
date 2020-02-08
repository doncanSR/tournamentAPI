import { Router } from 'express'
import { VerifyToken } from "../utils/verifyTokem";
import { RefereeController } from "../controllers/referee-controller";
import { Roles } from "../controllers/roles-controller";

const role: Roles = new Roles();
const verifyToken: VerifyToken = new VerifyToken();
const refereeController: RefereeController = new RefereeController();
const refereeRoutes = Router()

  .get('/', refereeController.getReferee)
  .post('/', verifyToken.check, role.levelTwo, refereeController.addNewReferee)
  .delete('/', verifyToken.check, role.levelOne, refereeController.deleteReferee)
  .put('/', refereeController.updateReferee)

export { refereeRoutes }