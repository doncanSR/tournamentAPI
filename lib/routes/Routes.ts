import { Request, Response } from "express";
import { TournamentController } from "../controllers/tournament-controller";

export class Routes {

    public tournamentController: TournamentController = new TournamentController();

    public routes(app): void {
        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfull!!'
                })
            })
        //Tournament
        app.route('/tournamnet')
            //Get tournament
            .get(this.tournamentController.getTournament)
            //POST Create tournament
            .post(this.tournamentController.addNewTournament)

            //Delete tournament
            .delete((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'Tournament was deleted!!'
                })
            })
        // Teams
        app.route('/teams')
            //Get all the tournaments
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'Get all the teams'
                })
            })

    }
}