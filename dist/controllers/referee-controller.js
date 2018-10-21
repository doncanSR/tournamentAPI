"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const referee_model_1 = require("../models/referee-model");
const Referee = mongoose.model('Referee', referee_model_1.refereeSchema);
class RefereeController {
    /**
    * addNewReferee    */
    addNewReferee(req, res) {
        let newReferee = new Referee(req.body);
        newReferee.save((err, referee) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(referee);
        });
    }
    /**
     * getReferee  */
    getReferee(req, res) {
        Referee.find({}, (err, referee) => {
            if (err) {
            }
            res.status(200).json(referee);
        });
    }
    /**
     * getRefereeWithId
     */
    getRefereeWithId(req, res) {
        Referee.findById(req.params.refereeId, (err, referee) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(referee);
        });
    }
    updateReferee(req, res) {
        Referee.findOneAndUpdate({ _id: req.params.refereeId }, req.body, { new: true }, (err, referee) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(referee);
        });
    }
    deleteReferee(req, res) {
        Referee.remove({ _id: req.params.refereeId }, (err, referee) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json({ message: 'Successfully deleted referee!' });
        });
    }
}
exports.RefereeController = RefereeController;
//# sourceMappingURL=referee-controller.js.map