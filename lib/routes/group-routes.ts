import { GroupController } from "../controllers/group-controller";
import { Router } from 'express'
import { VerifyToken } from "../utils/verifyTokem";
import { Roles } from "../controllers/roles-controller";

const role: Roles = new Roles();
const verifyToken: VerifyToken = new VerifyToken();
const groupController: GroupController = new GroupController();
const groupRoutes = Router()

  .get('/', groupController.getGroup)
  .post('/', verifyToken.check, role.levelOne, groupController.addNewGroup)
  .put('/', groupController.updateGroup)
  .delete('/', groupController.deleteGroup)

export { groupRoutes }