import express from 'express' ;
import { isManager } from '../middlewares/isManager';
import { addPersonnelController, findPersonel, loginPersonnelController } from '../controllers/personnelController';
import { verifySuperAdmin } from '../middlewares/verifySuperAdmin ';


const router = express.Router() ;

router.post('/add', verifySuperAdmin , addPersonnelController)
router.post('/login' ,loginPersonnelController )
router.get('/find' , findPersonel)

export default router ;