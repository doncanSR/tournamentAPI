"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const match_model_1 = require("../models/match-model");
const Match = mongoose.model('Match', match_model_1.matchSchema);
class MatchController {
    /**
    * addNewTeam    */
    addNewMatch(req, res) {
        let newMatch = new Match(req.body);
        newMatch.save((err, match) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(match);
        });
    }
    /**
     * getTeam  */
    getMatch(req, res) {
        Match.find({}, (err, match) => {
            if (err) {
            }
            res.status(200).json(match);
        });
    }
    /**
     * getMatchWithId
     */
    getMatchWithId(req, res) {
        Match.findById(req.params.matchId, (err, match) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(match);
        });
    }
    updateMatch(req, res) {
        Match.findOneAndUpdate({ _id: req.params.matchId }, req.body, { new: true }, (err, match) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(match);
        });
    }
    deleteMatch(req, res) {
        Match.remove({ _id: req.params.matchId }, (err, match) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json({ message: 'Successfully deleted match!' });
        });
    }
}
exports.MatchController = MatchController;
//# sourceMappingURL=match-controller.js.map