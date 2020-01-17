// Core
import { Request, Response } from 'express';
// Routes
import { faseRoutes } from './fase-routes';
import { tournamentRoutes } from './tournament-routes';
import { catFaseRoutes } from './cat-fase-routes';
import { playerRoutes } from './player-routes';
import { teamRoutes } from './team-routes';
import { groupRoutes } from './group-routes';
import { roleRoutes } from './role-routes';
import { refereeRoutes } from './referee-routes';
import { matchRoutes } from './match-routes';
import { courtRoutes } from './court-routes';
export class Routes {
  public routes(app): void {
    //Server status
    app.route('/').get((req: Request, res: Response) => {
      res.status(200).send({
        message: 'Server is working well!'
      });
    });
    //Tournament
    app.use('/api/v1/tournament', tournamentRoutes);
    // Teams
    app.use('/api/v1/teams', teamRoutes);
    //Group
    app.use('/api/v1/gruop', groupRoutes);
    //Fase
    app.use('/api/v1/fase', faseRoutes);
    //Fase catalogue
    app.use('/api/v1/catFase', catFaseRoutes);
    // Player
    app.use('/api/v1/player', playerRoutes);
    // Role
    app.use('/api/v1/role', roleRoutes);
    // Court
    app.use('/api/v1/court', courtRoutes);
    // Match
    app.use('/api/v1/match', matchRoutes);
    // Referee
    app.use('/api/v1/referee', refereeRoutes);
  }
}
