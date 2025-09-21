import express from 'express'
import { LoginSuperAdmin } from '../controllers/loginSuperAdmin';
import { verifySuperAdmin } from '../middlewares/verifySuperAdmin ';
// import { router } from '.';
 const router = express.Router()
router.get('/test', verifySuperAdmin, (req , res ) => {
    return res.send("test router")
})
router.post('/v1/login' , LoginSuperAdmin)

export default router ;
