import express from "express";
import { createBooking,paymentSuccess,patientBooking,doctorBooking,cancelBookingDoctor,cancelBookingPatient,createWallet,createBookingWithWallet,rescheduleBooking,updateBookingReschedule } from "../Controllers/bookingController.js";
import { UserAuthenticate } from "../auth/verifyUserToken.js";
import { verifyUserBlocked } from "../auth/verifyUserBlocked.js";
import { DoctorAuthenticate,restrict } from '../auth/verifyDoctorToken.js';
import {verifyDoctorBlocked} from '../auth/verifyDoctorBlocked.js'

const router=express.Router() 
router.post('/createBooking',UserAuthenticate,verifyUserBlocked,createBooking);
router.post('/createBookingwithWallet',UserAuthenticate,verifyUserBlocked,createBookingWithWallet);
router.post('/createwallet',UserAuthenticate,verifyUserBlocked,createWallet);

router.put('/paymentSuccess',UserAuthenticate,verifyUserBlocked,paymentSuccess);
router.put('/cancelBooking/:bookingId',DoctorAuthenticate,verifyDoctorBlocked,cancelBookingDoctor);
router.put('/rescheduleBooking/:bookingId',DoctorAuthenticate,verifyDoctorBlocked,rescheduleBooking);
router.put('/saveRescheduledSlot/:bookingId',DoctorAuthenticate,verifyDoctorBlocked,updateBookingReschedule);
router.put('/cancelBookingPatient/:bookingId',UserAuthenticate,verifyUserBlocked,cancelBookingPatient);
router.get('/patientBooking',UserAuthenticate,verifyUserBlocked,patientBooking);
router.get('/doctorBooking',DoctorAuthenticate,verifyDoctorBlocked,doctorBooking);


export default router
