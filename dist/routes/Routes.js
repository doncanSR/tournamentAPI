"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Controllers
const tournament_controller_1 = require("../controllers/tournament-controller");
const team_controller_1 = require("../controllers/team-controller");
const group_controller_1 = require("../controllers/group-controller");
const cat_fase_controller_1 = require("../controllers/cat-fase-controller");
const fase_controller_1 = require("../controllers/fase-controller");
const player_controller_1 = require("../controllers/player-controller");
const match_controller_1 = require("../controllers/match-controller");
const referee_controller_1 = require("../controllers/referee-controller");
const capturist_controller_1 = require("../controllers/capturist-controller");
const verifyTokem_1 = require("../utils/verifyTokem");
const roles_controller_1 = require("../controllers/roles-controller");
class Routes {
    constructor() {
        this.tournamentController = new tournament_controller_1.TournamentController();
        this.teamController = new team_controller_1.TeamController();
        this.groupController = new group_controller_1.GroupController();
        this.catFaseController = new cat_fase_controller_1.CatFaseController();
        this.faseController = new fase_controller_1.FaseController();
        this.playerController = new player_controller_1.PlayerController();
        this.matchController = new match_controller_1.MatchController();
        this.refereeController = new referee_controller_1.RefereeController();
        this.capturistController = new capturist_controller_1.CapturistController();
        this.role = new roles_controller_1.Roles();
        this.verifyToken = new verifyTokem_1.VerifyToken();
    }
    routes(app) {
        //Server status
        app.route('/')
            .get((req, res) => {
            res.status(200).send({
                message: 'Server is working well!'
            });
        });
        //Tournament
        app.route('/tournamnet')
            .get(this.tournamentController.getTournament)
            .post(this.tournamentController.addNewTournament)
            .delete(this.tournamentController.deleteTournament);
        // Teams
        app.route('/teams')
            .get(this.verifyToken.check, this.role.levelThree, this.teamController.getTeam)
            .post(this.teamController.addNewTeam)
            .delete(this.teamController.deleteTeam);
        //Group
        app.route('/gruop')
            .get(this.groupController.getGroup)
            .post(this.groupController.addNewGroup)
            .delete(this.groupController.deleteGroup);
        //Fase 
        app.route('/fase')
            .get(this.faseController.getFase)
            .post(this.faseController.addNewFase)
            .delete(this.faseController.deleteFase);
        //Fase catalogue
        app.route('/catFase')
            .get(this.catFaseController.getCatFase)
            .post(this.catFaseController.addNewCatFase)
            .delete(this.catFaseController.deleteCatFase);
        // Player
        app.route('/player')
            .get(this.playerController.getPlayer)
            .post(this.playerController.addNewPlayer)
            .delete(this.playerController.deletePlayer);
        // Match
        app.route('/match')
            .get(this.matchController.getMatch)
            .post(this.matchController.addNewMatch)
            .delete(this.matchController.deleteMatch);
        // Capturist
        app.route('/capturist')
            .get(this.capturistController.getCapturist)
            .post(this.capturistController.addNewCapturist)
            .delete(this.capturistController.deleteCapturist);
        //login using capturist
        app.route('/login/capturist')
            .post(this.capturistController.getCapturistWithId);
        // Referee
        app.route('/referee')
            .get(this.refereeController.getReferee)
            .post(this.refereeController.addNewReferee)
            .delete(this.refereeController.deleteReferee);
        // Roles 
        app.route('/role')
            .post(this.role.addManager);
        app.route('/role/auth')
            .post(this.role.getRol);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=Routes.js.map