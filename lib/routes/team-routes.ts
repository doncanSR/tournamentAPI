import { TeamController } from "../controllers/team-controller";
import { Router } from 'express'
import { VerifyToken } from "../utils/verifyTokem";
import { Roles } from "../controllers/roles-controller";

const role: Roles = new Roles();
const verifyToken: VerifyToken = new VerifyToken();
const teamController: TeamController = new TeamController();
const teamRoutes = Router()

  .get('/', teamController.getTeam)
  .post('/', verifyToken.check, teamController.addNewTeam)
  .delete('/', verifyToken.check, role.levelOne, teamController.deleteTeam)
  .put('/', teamController.updateTeam)

export { teamRoutes }