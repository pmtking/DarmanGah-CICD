

import express from 'express'
import { posix } from 'path'
import { createReceptionController } from '../controllers/reseptionController'

const router = express.Router()

router.post('/add' ,createReceptionController )
export default router