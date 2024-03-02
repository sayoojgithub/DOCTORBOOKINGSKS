import express from 'express'
import { updateDoctor,deleteDoctor,getAllDoctor,getSingleDoctor,getDoctorProfile,addDoctorExperience,removeDoctorExperience,saveAvailability,getAvailability } from '../Controllers/doctorController.js'
import { DoctorAuthenticate,restrict } from '../auth/verifyDoctorToken.js';
import { UserAuthenticate } from "../auth/verifyUserToken.js";
import {verifyUserBlocked} from '../auth/verifyUserBlocked.js'
import { verifyDoctorBlocked } from '../auth/verifyDoctorBlocked.js';


const router=express.Router()
router.get("/:id",DoctorAuthenticate,getSingleDoctor);
router.get('/',UserAuthenticate,verifyUserBlocked,getAllDoctor);
router.put('/:id',DoctorAuthenticate,restrict(['doctor']),updateDoctor);
router.put('/experiencesAdd/:id',DoctorAuthenticate,restrict(['doctor']),addDoctorExperience);
router.put('/experiencesDelete/:id',DoctorAuthenticate,restrict(['doctor']),removeDoctorExperience);
router.put('/saveAvailability/:id',DoctorAuthenticate,restrict(['doctor']),saveAvailability);
router.get('/getAvailability/:id/:date', DoctorAuthenticate,restrict(['doctor']),getAvailability);
router.delete('/:id',DoctorAuthenticate,restrict(['doctor']),deleteDoctor);
router.get('/profile/me/:id',DoctorAuthenticate,restrict(['doctor']),verifyDoctorBlocked,getDoctorProfile);


export default router