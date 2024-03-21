import express from 'express'
import { createChat,userChats,findChat,findUser,updateLastSeen } from '../Controllers/chatController.js'
const router=express.Router()
router.post('/createChat',createChat)
router.post('/findUser',findUser)
router.get('/:userId',userChats)
router.get('/find/:firstId/:secondId',findChat)
router.patch('/updateLastSeen',updateLastSeen)

export default router