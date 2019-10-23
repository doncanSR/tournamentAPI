import { PlayerController } from "../controllers/player-controller";
import { Router } from 'express'
import { VerifyToken } from "../utils/verifyTokem";
import { Roles } from "../controllers/roles-controller";

const role: Roles = new Roles();
const verifyToken: VerifyToken = new VerifyToken();
const playerController: PlayerController = new PlayerController();
const playerRoutes = Router()

  .get('/', playerController.getPlayer)
  .post('/', verifyToken.check, role.levelThree, playerController.addNewPlayer)
  .put('/', playerController.updatePlayer)
  .delete('/', verifyToken.check, role.levelThree, playerController.deletePlayer)
  .get('/team', playerController.getByTeamID)

export { playerRoutes }