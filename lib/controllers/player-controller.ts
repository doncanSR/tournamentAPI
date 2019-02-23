
import * as mongoose from 'mongoose';
import { playerSchema } from '../models/player-model';
import { teamSchema } from "../models/team-model";
import { Request, Response } from 'express';

const Player = mongoose.model('Player', playerSchema);
const Team = mongoose.model('Team', teamSchema);

export class PlayerController {
  /**
  * addNewTeam    */
  public addNewPlayer(req: Request, res: Response) {
    let newPlayer = new Player(req.body);
    let newTeam;
    newPlayer.save((err, player) => {
      if (err) {
        res.send(err);
      }
      Player.count({ 'teamID': player.teamID }, (err, number) => {
        if (err) {
          newTeam = {playersNo :0};
        }
        newTeam = {playersNo : number}
        Team.findOneAndUpdate({ _id: player.teamID }, newTeam, { new: true }, (err, team) => {
          if (err) {
            res.send(err);
          }
          res.status(200).json(player);
        });
      })
    })
  }


  /**
   * getTeam  */
  public getPlayer(req: Request, res: Response) {
    Player.find({}, (err, player) => {
      if (err) {

      }
      res.json(player);
    })
  }

  /**
   * getPlayerWithId
   */
  public getPlayerWithId(req: Request, res: Response) {
    Player.findById(req.params.playerId, (err, player) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(player);
    })
  }

  /**
   * getByTeamID
   */
  public getByTeamID(req: Request, res: Response) {
    Player.find({ 'teamID': req.body.teamID }, (err, players) => {
      if (err) {
        res.send({ error: { code: '404', message: 'user not found' } });
      }
      res.status(200).json(players);
    })
  }

  public updatePlayer(req: Request, res: Response) {
    Player.findOneAndUpdate({ _id: req.query.playerId }, req.body, { new: true }, (err, player) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(player);
    });
  }

  public deletePlayer(req: Request, res: Response) {
    Player.remove({ _id: req.params.playerId }, (err, player) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: 'Successfully deleted player!' });
    });
  }
}