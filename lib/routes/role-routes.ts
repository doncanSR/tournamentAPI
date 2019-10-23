import { Router } from 'express'
import { VerifyToken } from "../utils/verifyTokem";
import { RefereeController } from "../controllers/referee-controller";
import { Roles } from "../controllers/roles-controller";

const role: Roles = new Roles();
const verifyToken: VerifyToken = new VerifyToken();
const refereeController: RefereeController = new RefereeController();
const roleRoutes = Router()

  .post('/', verifyToken.check, role.levelOne, role.addUser)
  .delete('/', verifyToken.check, role.levelOne, role.deleteUser)
  .put('/', refereeController.updateReferee, role.levelOne, role.updateUser)
  .post('/role/auth', role.logIn)
  .post('/role/auth/logout', verifyToken.check, role.logOut)
  .get('/manager', verifyToken.check, role.adminLevel, role.getManagers)
  .get('/capturist', verifyToken.check, role.levelOne, role.getCapturist)
  .get('/coaches', verifyToken.check, role.levelTwo, role.getCoaches)
  .post('/coaches', role.createCoach)

export { roleRoutes }