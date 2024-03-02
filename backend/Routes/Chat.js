import express from 'express'
import { createChat,userChats,findChat,findUser } from '../Controllers/chatController.js'
const router=express.Router()
router.post('/createChat',createChat)
router.post('/findUser',findUser)
router.get('/:userId',userChats)
router.get('/find/:firstId/:secondId',findChat)

export default router