import { model } from 'mongoose';
import { groupSchema } from '../models/group-model';
import { Request, Response } from 'express';

const Group = model('Group', groupSchema);

export class GroupController {
  /**
   * addNewTeam    */
  public addNewGroup(req: Request, res: Response) {
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
  public getGroup(req: Request, res: Response) {
    Group.find({}, (err, group) => {
      if (err) {
      }
      res.status(200).json(group);
    });
  }

  /**
   * getGroupWithId
   */
  public getGroupWithId(req: Request, res: Response) {
    Group.findById(req.params.groupId, (err, group) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(group);
    });
  }

  public updateGroup(req: Request, res: Response) {
    Group.findOneAndUpdate(
      { _id: req.query.groupId },
      req.body,
      { new: true },
      (err, group) => {
        if (err) {
          res.send(err);
        }
        res.status(200).json(group);
      }
    );
  }

  public deleteGroup(req: Request, res: Response) {
    Group.remove({ _id: req.params.groupId }, (err, group) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: 'Successfully deleted group!' });
    });
  }
}
