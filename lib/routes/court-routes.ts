import { CourtController } from "../controllers/court-controller";
import { Router } from 'express'

const courtController: CourtController = new CourtController();
const courtRoutes = Router()

  .get('/', courtController.getCourt)
  .post('/', courtController.addNewCourt)
  .delete('/', courtController.deleteCourt)
  .put('/', courtController.updateCourt)

export { courtRoutes }
