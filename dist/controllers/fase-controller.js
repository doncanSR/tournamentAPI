"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const fase_model_1 = require("../models/fase/fase-model");
const Fase = mongoose.model('Fase', fase_model_1.faseSchema);
class FaseController {
    /**
    * addNewTeam    */
    addNewFase(req, res) {
        let newFase = new Fase(req.body);
        newFase.save((err, fase) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(fase);
        });
    }
    /**
     * getTeam  */
    getFase(req, res) {
        Fase.find({}, (err, fase) => {
            if (err) {
            }
            res.status(200).json(fase);
        });
    }
    /**
     * getFaseWithId
     */
    getFaseWithId(req, res) {
        Fase.findById(req.params.faseId, (err, fase) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(fase);
        });
    }
    updateFase(req, res) {
        Fase.findOneAndUpdate({ _id: req.query.faseId }, req.body, { new: true }, (err, fase) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(fase);
        });
    }
    deleteFase(req, res) {
        Fase.remove({ _id: req.params.faseId }, (err, fase) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json({ message: 'Successfully deleted fase!' });
        });
    }
}
exports.FaseController = FaseController;
//# sourceMappingURL=fase-controller.js.map