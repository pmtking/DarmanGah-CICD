import express from 'express' 
import { LoginController, RegisterController } from './authController';


export const authRouter = express.Router();
// test
authRouter.get('/test' , (req , res) => {
    res.send('test auth')
})

// register Controller 

authRouter.post('/register'  ,RegisterController)
authRouter.post('/login' , LoginController)