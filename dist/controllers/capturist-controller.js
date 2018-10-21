"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const capturist_model_1 = require("../models/capturist-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Capturist = mongoose.model('Capturist', capturist_model_1.capturistSchema);
class CapturistController {
    /**
    * addNewTeam    */
    addNewCapturist(req, res) {
        let newCapturist = new Capturist(req.body);
        newCapturist.save((err, capturist) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(capturist);
        });
    }
    /**
     * getTeam  */
    getCapturist(req, res) {
        Capturist.find({}, (err, capturist) => {
            if (err) {
            }
            res.status(200).json(capturist);
        });
    }
    /**
     * getCapturistWithId
     */
    getCapturistWithId(req, res) {
        Capturist.findById(req.body.capturistId, (err, capturist) => {
            if (err) {
                res.status(404).send(err);
            }
            let passwordIsValid = bcrypt.compareSync(req.body.password, capturist.password);
            if (passwordIsValid)
                return res.status(401).send({ auth: false, token: null });
            // create a token
            let token = jwt.sign({ id: capturist.id, name: capturist.name }, 'secret');
            res.status(200).send({ auth: true, token: token, name: capturist.name });
        });
    }
    updateCapturist(req, res) {
        Capturist.findOneAndUpdate({ _id: req.params.capturistId }, req.body, { new: true }, (err, capturist) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(capturist);
        });
    }
    deleteCapturist(req, res) {
        Capturist.remove({ _id: req.params.capturistId }, (err, capturist) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json({ message: 'Successfully deleted capturist!' });
        });
    }
}
exports.CapturistController = CapturistController;
//# sourceMappingURL=capturist-controller.js.map