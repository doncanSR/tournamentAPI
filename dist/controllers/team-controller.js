"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const team_model_1 = require("../models/team-model");
const Team = mongoose.model('Team', team_model_1.teamSchema);
class TeamController {
    /**
    * addNewTeam    */
    addNewTeam(req, res) {
        let newTeam = new Team(req.body);
        newTeam.save((err, team) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(team);
        });
    }
    /**
     * getTeam  */
    getTeam(req, res) {
        Team.find({}, (err, teams) => {
            if (err) {
            }
            res.status(200).json(teams);
        });
    }
    /**
     * getTornamentWithId
     */
    getTeamWithId(req, res) {
        Team.findById(req.params.teamId, (err, team) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(team);
        });
    }
    updateTeam(req, res) {
        Team.findOneAndUpdate({ _id: req.params.teamId }, req.body, { new: true }, (err, team) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(team);
        });
    }
    deleteTeam(req, res) {
        Team.remove({ _id: req.params.teamId }, (err, team) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json({ message: 'Successfully deleted Team!' });
        });
    }
}
exports.TeamController = TeamController;
//# sourceMappingURL=team-controller.js.map