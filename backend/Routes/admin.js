import express from "express";
import { AdminAuthenticate } from "../auth/verifyAdminToken.js";
import { adminLogin,getAllDoctor,getAllUser,handleBlock,handleBlockDoctors,handleApproval,getAllBookings,addService,getAllServices,updateService,bookingAppointmentPerDate,countUsers,countDoctors,countServices,countrevenue,bookingPerSpecialization,doctorsPerSpecialization } from "../Controllers/adminController.js";
const router=express.Router()
router.post('/login',adminLogin)
router.get('/allUsers',AdminAuthenticate,getAllUser)
router.get('/allDoctors',AdminAuthenticate,getAllDoctor)
router.get('/allBookings',AdminAuthenticate,getAllBookings)
router.put('/handleblock/:id',AdminAuthenticate,handleBlock)
router.put('/handleblockDoctor/:id',AdminAuthenticate,handleBlockDoctors)
router.put('/handleApproval/:id',AdminAuthenticate,handleApproval)
router.post('/addService',AdminAuthenticate,addService)
router.get('/getServices',getAllServices)
router.put('/updateService/:id',AdminAuthenticate,updateService );

//analytics
router.get('/NumberOfBookingPerDay',bookingAppointmentPerDate)
router.get('/NumberOfUsers',countUsers)
router.get('/NumberOfDoctors',countDoctors)
router.get('/NumberOfServices',countServices)
router.get('/revenue',countrevenue)
router.get('/bookingPerSpecialization',bookingPerSpecialization)
router.get('/doctorsPerSpecialization',doctorsPerSpecialization)












export default router