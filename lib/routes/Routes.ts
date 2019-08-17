// Core 
import { Request, Response } from "express";
// Controllers
import { TournamentController } from "../controllers/tournament-controller";
import { TeamController } from "../controllers/team-controller";
import { GroupController } from "../controllers/group-controller";
import { CatFaseController } from "../controllers/cat-fase-controller";
import { FaseController } from "../controllers/fase-controller";
import { PlayerController } from "../controllers/player-controller";
import { MatchController } from "../controllers/match-controller";
import { RefereeController } from "../controllers/referee-controller";
import { VerifyToken } from "../utils/verifyTokem";
import { Roles } from "../controllers/roles-controller";
import { CourtController } from "../controllers/court-controller";

export class Routes {

  public tournamentController: TournamentController = new TournamentController();
  public teamController: TeamController = new TeamController();
  public groupController: GroupController = new GroupController();
  public catFaseController: CatFaseController = new CatFaseController();
  public faseController: FaseController = new FaseController();
  public playerController: PlayerController = new PlayerController();
  public matchController: MatchController = new MatchController();
  public refereeController: RefereeController = new RefereeController();
  public role: Roles = new Roles();
  public verifyToken: VerifyToken = new VerifyToken();
  public courtController: CourtController = new CourtController();

  public routes(app): void {
    //Server status
    app.route('/')
      .get((req: Request, res: Response) => {
        res.status(200).send({
          message: 'Server is working well!'
        })
      })
    //Tournament
    app.route('/tournament')
      .get(this.tournamentController.getTournament)
      .post(this.verifyToken.check, this.role.levelOne, this.tournamentController.addNewTournament)
      .delete(this.verifyToken.check, this.role.adminLevel, this.tournamentController.deleteTournament)
      .put(this.tournamentController.updateTournament)

    // Teams
    app.route('/teams')
      .get(this.teamController.getTeam)
      .post(this.verifyToken.check, this.teamController.addNewTeam)
      .delete(this.verifyToken.check, this.role.levelOne, this.teamController.deleteTeam)
      .put(this.teamController.updateTeam)
    //Group
    app.route('/gruop')
      .get(this.groupController.getGroup)
      .post(this.verifyToken.check, this.role.levelOne, this.groupController.addNewGroup)
      .put(this.groupController.updateGroup)
      .delete(this.groupController.deleteGroup)
    //Fase 
    app.route('/fase')
      .get(this.faseController.getFase)
      .post(this.faseController.addNewFase)
      .put(this.faseController.updateFase)
      .delete(this.faseController.deleteFase)
    //Fase catalogue
    app.route('/catFase')
      .get(this.catFaseController.getCatFase)
      .post(this.catFaseController.addNewCatFase)
      .put(this.catFaseController.updateCatFase)
      .delete(this.catFaseController.deleteCatFase)
    // Player
    app.route('/player')
      .get(this.playerController.getPlayer)
      .post(this.verifyToken.check, this.role.levelThree, this.playerController.addNewPlayer)
      .put(this.playerController.updatePlayer)
      .delete(this.verifyToken.check, this.role.levelThree, this.playerController.deletePlayer)
    app.route('/player/team')
      .get(this.playerController.getByTeamID)
    // Coach
    app.route('/coach')
      .get(this.verifyToken.check, this.role.levelTwo, this.role.getCoaches)
      .post(this.role.createCoach)
    //Manager
    app.route('/manager')
      .get(this.verifyToken.check, this.role.adminLevel, this.role.getManagers)
    // Capturist
    app.route('/capturist')
      .get(this.verifyToken.check, this.role.levelOne, this.role.getCapturist)
    // Court
    app.route('/court')
      .get(this.courtController.getCourt)
      .post(this.courtController.addNewCourt)
      .delete(this.courtController.deleteCourt)
      .put(this.courtController.updateCourt)
    // Match
    app.route('/match')
      .get(this.matchController.getMatch)
      .post(this.verifyToken.check, this.role.levelTwo, this.matchController.addNewMatch)
      .delete(this.verifyToken.check, this.role.levelOne, this.matchController.deleteMatch)
      .put(this.matchController.updateMatch)
    // Referee
    app.route('/referee')
      .get(this.verifyToken.check, this.role.levelTwo, this.refereeController.getReferee)
      .post(this.verifyToken.check, this.role.levelTwo, this.refereeController.addNewReferee)
      .delete(this.verifyToken.check, this.role.levelOne, this.refereeController.deleteReferee)
      .put(this.refereeController.updateReferee)
    // Roles 
    app.route('/role')
      .post(this.verifyToken.check, this.role.levelOne, this.role.addUser)
      .delete(this.verifyToken.check, this.role.levelOne, this.role.deleteUser)
      .put(this.refereeController.updateReferee, this.role.levelOne, this.role.updateUser)
    app.route('/role/auth')
      .post(this.role.logIn)
    app.route('/role/auth/logout')
      .post(this.verifyToken.check, this.role.logOut)
  }
}