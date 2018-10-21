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
import { CapturistController } from "../controllers/capturist-controller";

export class Routes {

  public tournamentController: TournamentController = new TournamentController();
  public teamController: TeamController = new TeamController();
  public groupController: GroupController = new GroupController();
  public catFaseController: CatFaseController = new CatFaseController();
  public faseController: FaseController = new FaseController();
  public playerController: PlayerController = new PlayerController();
  public matchController: MatchController = new MatchController();
  public refereeController: RefereeController = new RefereeController();
  public capturistController: CapturistController = new CapturistController();

  public routes(app): void {
    //Server status
    app.route('/')
      .get((req: Request, res: Response) => {
        res.status(200).send({
          message: 'Server is working well!'
        })
      })
    //Tournament
    app.route('/tournamnet')
      .get(this.tournamentController.getTournament)
      .post(this.tournamentController.addNewTournament)
      .delete(this.tournamentController.deleteTournament)
    // Teams
    app.route('/teams')
      .get(this.teamController.getTeam)
      .post(this.teamController.addNewTeam)
      .delete(this.teamController.deleteTeam)
    //Group
    app.route('/gruop')
      .get(this.groupController.getGroup)
      .post(this.groupController.addNewGroup)
      .delete(this.groupController.deleteGroup)
    //Fase 
    app.route('/fase')
      .get(this.faseController.getFase)
      .post(this.faseController.addNewFase)
      .delete(this.faseController.deleteFase)
    //Fase catalogue
    app.route('/catFase')
      .get(this.catFaseController.getCatFase)
      .post(this.catFaseController.addNewCatFase)
      .delete(this.catFaseController.deleteCatFase)
    // Player
    app.route('/player')
      .get(this.playerController.getPlayer)
      .post(this.playerController.addNewPlayer)
      .delete(this.playerController.deletePlayer)
    // Match
    app.route('/match')
      .get(this.matchController.getMatch)
      .post(this.matchController.addNewMatch)
      .delete(this.matchController.deleteMatch)
    // Capturist
    app.route('/capturist')
      .get(this.capturistController.getCapturist)
      .post(this.capturistController.addNewCapturist)
      .delete(this.capturistController.deleteCapturist)
    //login using capturist
    app.route('/login/capturist')
      .post(this.capturistController.getCapturistWithId)
    // Referee
    app.route('/referee')
      .get(this.refereeController.getReferee)
      .post(this.refereeController.addNewReferee)
      .delete(this.refereeController.deleteReferee)
  }
}