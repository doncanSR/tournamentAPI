"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const tournament_model_1 = require("../models/tournament-model");
const Tournament = mongoose.model('Tournament', tournament_model_1.tournmanetSchema);
class TournamentController {
    addNewTournament(req, res) {
        let newTournament = new Tournament(req.body);
        newTournament.save((err, tournament) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(tournament);
        });
    }
    getTournament(req, res) {
        Tournament.find({}, (err, tournaments) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(tournaments);
        });
    }
    getTournamentWithID(req, res) {
        Tournament.findById(req.params.tournamentId, (err, tournament) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(tournament);
        });
    }
    updateTournament(req, res) {
        Tournament.findOneAndUpdate({ _id: req.query.tournamentId }, req.body, { new: true }, (err, tournament) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(tournament);
        });
    }
    deleteTournament(req, res) {
        Tournament.remove({ _id: req.params.tournamentId }, (err, tournament) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json({ message: 'Successfully deleted tournament!' });
        });
    }
}
exports.TournamentController = TournamentController;
//# sourceMappingURL=tournament-controller.js.map