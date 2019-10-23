import { CatFaseController } from "../controllers/cat-fase-controller";
import { Router } from 'express'

const catFaseController: CatFaseController = new CatFaseController();
const catFaseRoutes = Router()

  .get('/', catFaseController.getCatFase)
  .post('/', catFaseController.addNewCatFase)
  .put('/', catFaseController.updateCatFase)
  .delete('/', catFaseController.deleteCatFase)

export { catFaseRoutes }