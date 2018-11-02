"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const group_model_1 = require("../models/group-model");
const Group = mongoose.model('Group', group_model_1.groupSchema);
class GroupController {
    /**
    * addNewTeam    */
    addNewGroup(req, res) {
        let newGroup = new Group(req.body);
        newGroup.save((err, group) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(group);
        });
    }
    /**
     * getTeam  */
    getGroup(req, res) {
        Group.find({}, (err, group) => {
            if (err) {
            }
            res.status(200).json(group);
        });
    }
    /**
     * getGroupWithId
     */
    getGroupWithId(req, res) {
        Group.findById(req.params.groupId, (err, group) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(group);
        });
    }
    updateGroup(req, res) {
        Group.findOneAndUpdate({ _id: req.query.groupId }, req.body, { new: true }, (err, group) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(group);
        });
    }
    deleteGroup(req, res) {
        Group.remove({ _id: req.params.groupId }, (err, group) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json({ message: 'Successfully deleted group!' });
        });
    }
}
exports.GroupController = GroupController;
//# sourceMappingURL=group-controller.js.map