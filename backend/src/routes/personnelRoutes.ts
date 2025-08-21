import express from 'express' ;
import { isManager } from '../middlewares/isManager';
import { addPersonnelController } from '../controllers/personnelController';


const router = express.Router() ;

router.post('/app', isManager , addPersonnelController)