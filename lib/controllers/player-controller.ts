
import * as mongoose from 'mongoose';
import { playerSchema } from '../models/player-model';
import { Request, Response } from 'express';

const Player = mongoose.model('Player', playerSchema);

export class PlayerController {
  /**
  * addNewTeam    */
  public addNewPlayer(req: Request, res: Response) {
    let newPlayer = new Player(req.body);

    newPlayer.save((err, player) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(player);
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