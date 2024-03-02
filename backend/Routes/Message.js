import express from 'express'
import { addMessage,getMessages } from '../Controllers/messageController.js'

const router=express.Router()

router.post('/addMessage',addMessage)
router.get('/getMessages/:chatId',getMessages)

export default router