import { CatPhaseController } from "../controllers/cat-phase-controller";
import { Router } from 'express'

const catPhaseController: CatPhaseController = new CatPhaseController();
const catPhaseRoutes = Router()

  .get('/', catPhaseController.getCatPhase)
  .post('/', catPhaseController.addNewCatPhase)
  .put('/', catPhaseController.updateCatPhase)
  .delete('/', catPhaseController.deleteCatPhase)

export { catPhaseRoutes }