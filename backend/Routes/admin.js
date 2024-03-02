import express from "express";
import { adminLogin,getAllDoctor,getAllUser,handleBlock,handleBlockDoctors,handleApproval,getAllBookings,addService,getAllServices,updateService,bookingAppointmentPerDate,countUsers,countDoctors,countServices,countrevenue,bookingPerSpecialization,doctorsPerSpecialization } from "../Controllers/adminController.js";
const router=express.Router()
router.post('/login',adminLogin)
router.get('/allUsers',getAllUser)
router.get('/allDoctors',getAllDoctor)
router.get('/allBookings',getAllBookings)
router.put('/handleblock/:id',handleBlock)
router.put('/handleblockDoctor/:id',handleBlockDoctors)
router.put('/handleApproval/:id',handleApproval)
router.post('/addService',addService)
router.get('/getServices',getAllServices)
router.put('/updateService/:id',updateService );

//analytics
router.get('/NumberOfBookingPerDay',bookingAppointmentPerDate)
router.get('/NumberOfUsers',countUsers)
router.get('/NumberOfDoctors',countDoctors)
router.get('/NumberOfServices',countServices)
router.get('/revenue',countrevenue)
router.get('/bookingPerSpecialization',bookingPerSpecialization)
router.get('/doctorsPerSpecialization',doctorsPerSpecialization)












export default router