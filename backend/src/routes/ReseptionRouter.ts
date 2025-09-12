

import express from 'express'
import { posix } from 'path'
import { createReseptionController } from '../controllers/reseptionController'

const router = express.Router()

router.post('/add' , createReseptionController)
export default router