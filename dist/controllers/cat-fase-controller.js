"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const cat_fase_model_1 = require("../models/fase/cat-fase-model");
const CatFase = mongoose.model('CatFase', cat_fase_model_1.catFaseSchema);
class CatFaseController {
    /**
    * addNewTeam    */
    addNewCatFase(req, res) {
        let newCatFase = new CatFase(req.body);
        newCatFase.save((err, catFase) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(catFase);
        });
    }
    /**
     * getTeam  */
    getCatFase(req, res) {
        CatFase.find({}, (err, catFase) => {
            if (err) {
            }
            res.status(200).json(catFase);
        });
    }
    /**
     * getCatFaseWithId
     */
    getCatFaseWithId(req, res) {
        CatFase.findById(req.params.catFaseId, (err, catFase) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(catFase);
        });
    }
    updateCatFase(req, res) {
        CatFase.findOneAndUpdate({ _id: req.query.catFaseId }, req.body, { new: true }, (err, catFase) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(catFase);
        });
    }
    deleteCatFase(req, res) {
        CatFase.remove({ _id: req.params.catFaseId }, (err, catFase) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json({ message: 'Successfully deleted catFase!' });
        });
    }
}
exports.CatFaseController = CatFaseController;
//# sourceMappingURL=cat-fase-controller.js.map