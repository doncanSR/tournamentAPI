"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const role_model_1 = require("../models/role-model");
const role = mongoose.model('role', role_model_1.rolSchema);
class Roles {
    /**
     * check
     */
    levelOne(req, res, next) {
        if (req.name && req.rol) {
            if (req.rol === "admin") {
                next();
            }
            else {
                return res.status(405).send({ auth: false, message: 'This user is not allowed.' });
            }
        }
    }
    /**
     * levelTwo */
    levelTwo(req, res, next) {
        if (req.name && req.rol) {
            if (req.rol === "manager") {
                next();
            }
            else {
                return res.status(405).send({ auth: false, message: 'This user is not allowed.' });
            }
        }
    }
    /**
     * levelTwo */
    levelThree(req, res, next) {
        if (req.name && req.rol) {
            if (req.rol === "capturist") {
                next();
            }
            else {
                return res.status(405).send({ auth: false, message: 'This user is not allowed.' });
            }
        }
    }
    /**
     * levelTwo */
    levelFour(req, res, next) {
        if (req.name && req.rol) {
            if (req.rol === "general") {
                next();
            }
            else {
                return res.status(405).send({ auth: false, message: 'This user is not allowed.' });
            }
        }
    }
    /**
     * addManager
     */
    addManager(req, res) {
        let newManager = new role(req.body);
        newManager.save((err, role) => {
            if (err) {
                res.send(err);
            }
            let token = jwt.sign({ name: role.name, role: role.rol }, 'secret');
            res.status(200).send({ auth: true, token: token, name: role.name });
        });
    }
    /**
     * getRol
     */
    getRol(req, res) {
        if (req.body.name === "adminSecret") {
            let passwordIsValid = bcrypt.compareSync(req.body.password, 'Qwerty94');
            if (passwordIsValid)
                return res.status(401).send({ auth: false, token: null });
            let token = jwt.sign({ name: 'adminSecret', role: 'admin' }, 'secret');
            res.status(200).send({ auth: true, token: token, name: role.name });
        }
        else {
            role.findById(req.body.roleId, (err, role) => {
                if (err) {
                    res.status(404).send(err);
                }
                let passwordIsValid = bcrypt.compareSync(req.body.password, role.password);
                if (passwordIsValid)
                    return res.status(401).send({ auth: false, token: null });
                // create a token
                let token = jwt.sign({ name: role.name, role: role.role }, 'secret');
                res.status(200).send({ auth: true, token: token, name: role.name });
            });
        }
    }
}
exports.Roles = Roles;
//# sourceMappingURL=roles-controller.js.map