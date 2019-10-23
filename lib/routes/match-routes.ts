import { MatchController } from "../controllers/match-controller";
import { Roles } from "../controllers/roles-controller";
import { VerifyToken } from "../utils/verifyTokem";
import { Router } from 'express'

let matchController: MatchController = new MatchController();
let role: Roles = new Roles();
let verifyToken: VerifyToken = new VerifyToken();
let matchRoutes = Router()

  .get('/schedules', matchController.getSchedule)
  .get('/', matchController.getMatch)
  .post('/', verifyToken.check, role.levelTwo, matchController.addNewMatch)
  .delete('/', verifyToken.check, role.levelOne, matchController.deleteMatch)
  .put('/', matchController.updateMatch)

export { matchRoutes }
