import { FaseController } from "../controllers/fase-controller";
import { Router } from 'express'

const faseController : FaseController = new FaseController();
const faseRoutes = Router()

  .get('/', faseController.getFase)
  .post('/', faseController.addNewFase)
  .put('/', faseController.updateFase)
  .delete('/', faseController.deleteFase)

export { faseRoutes }