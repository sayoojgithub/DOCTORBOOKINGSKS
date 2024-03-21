import express from "express";
import { updateUser,getSingleUser,getAllUser,getUserProfile,getMyAppointments,getDoctorDetails,addFriend,payment,getWalletHistoryByUserId,recharge,findMostRecentWallet } from "../Controllers/userController.js";
import { UserAuthenticate,restrict } from "../auth/verifyUserToken.js";
import {verifyUserBlocked} from '../auth/verifyUserBlocked.js'



const router=express.Router()
router.get('/current/:userId',UserAuthenticate,restrict(['patient']),getSingleUser)
router.get('/',UserAuthenticate,restrict(['admin']),getAllUser)
router.get('/IndividualPage/:doctorId',UserAuthenticate,restrict(['admin','patient']),getDoctorDetails)

router.put('/:id',UserAuthenticate,restrict(['patient']),verifyUserBlocked,updateUser)
router.put('/addFriend/:id',UserAuthenticate,restrict(['patient']),verifyUserBlocked,addFriend)

router.get('/profile/me/:id',UserAuthenticate,restrict(['patient']),verifyUserBlocked,getUserProfile)
router.get('/wallet/history/:userId', UserAuthenticate, restrict(['patient']), verifyUserBlocked, getWalletHistoryByUserId);
//next
router.get('appointments/my-appointments',getMyAppointments)
//payment
router.post('/payment',UserAuthenticate,restrict(['patient']),payment)
//recharge
router.post('/recharge',UserAuthenticate,restrict(['patient']),recharge)
//totalwalletamount
router.get('/totalAmount/:id',UserAuthenticate,restrict(['patient']),verifyUserBlocked,findMostRecentWallet)




export default router
