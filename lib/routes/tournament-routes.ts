import { TournamentController } from "../controllers/tournament-controller";
import { Router } from 'express'
import { VerifyToken } from "../utils/verifyTokem";
import { Roles } from "../controllers/roles-controller";

const role: Roles = new Roles();
const verifyToken: VerifyToken = new VerifyToken();
const tournamentController: TournamentController = new TournamentController();
const tournamentRoutes = Router()

  .get('/', tournamentController.getTournament)
  .post('/', verifyToken.check, role.levelOne, tournamentController.addNewTournament)
  .delete('/', verifyToken.check, role.adminLevel, tournamentController.deleteTournament)
  .put('/', tournamentController.updateTournament)
  .get('/tournamentTime/:tournamentId', tournamentController.getTournamentTime)
  .post('/init', tournamentController.initTournament)
  .post('/do-the-role', tournamentController.doTheRole)
export { tournamentRoutes }