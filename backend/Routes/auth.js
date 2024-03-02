import express from 'express'
import { register,login,otp,fpOtp,changepassword } from '../Controllers/authController.js'
import { UserAuthenticate } from "../auth/verifyUserToken.js";
import { DoctorAuthenticate,restrict } from '../auth/verifyDoctorToken.js';

const router=express.Router()
router.post('/register',register)
router.post('/login',login)
router.get('/otp:email',otp)
router.get('/fp/otp/:email',fpOtp)
router.post('/changepassword',changepassword)



export default router