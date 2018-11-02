"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const player_model_1 = require("../models/player-model");
const Player = mongoose.model('Player', player_model_1.playerSchema);
class PlayerController {
    /**
    * addNewTeam    */
    addNewPlayer(req, res) {
        let newPlayer = new Player(req.body);
        newPlayer.save((err, player) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(player);
        });
    }
    /**
     * getTeam  */
    getPlayer(req, res) {
        Player.find({}, (err, player) => {
            if (err) {
            }
            res.json(player);
        });
    }
    /**
     * getPlayerWithId
     */
    getPlayerWithId(req, res) {
        Player.findById(req.params.playerId, (err, player) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(player);
        });
    }
    updatePlayer(req, res) {
        Player.findOneAndUpdate({ _id: req.query.playerId }, req.body, { new: true }, (err, player) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(player);
        });
    }
    deletePlayer(req, res) {
        Player.remove({ _id: req.params.playerId }, (err, player) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json({ message: 'Successfully deleted player!' });
        });
    }
}
exports.PlayerController = PlayerController;
//# sourceMappingURL=player-controller.js.map