import Home from '../pages/Home'
import Services from '../pages/Services'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Contact from '../pages/Contact'
import Otp from '../pages/Otp'
import Email from '../pages/Email'
import FPotp from '../pages/FPotp'
import FPpassword from '../pages/FPpassword'
import Success from '../pages/Success'
import SuccessRecharge from '../pages/SuccessRecharge'
import Doctors from '../pages/Doctors/Doctors'
import DoctorDetails from '../pages/Doctors/DoctorDetails'
import Myaccount from '../Dashboard/user-account/Myaccount'
import Chat from '../pages/Chat/Chat'
import VideoCall from '../pages/videoCall/VideoCall'
import Dashboard from '../Dashboard/doctor-account/Dashboard'
import AdminLogin from '../pages/Admin/Login'
import AdminDashboard from '../pages/Admin/Dashboard'

import {Routes,Route} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'


const Routers = () => {
  return <Routes>
    <Route path='/' element={<Home/>}></Route>
    <Route path='/home' element={<Home/>}></Route>
    <Route path='/doctors' element={<ProtectedRoute allowedRoles={['patient']}><Doctors/></ProtectedRoute>}></Route>
    <Route path='/doctorDetails/:doctorId' element={<DoctorDetails/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
    <Route path='/register' element={<Signup/>}></Route>
    <Route path='/forgotPassword/email' element={<Email/>}></Route>
    <Route path='/forgotPassword/otp' element={<FPotp/>}></Route>
    <Route path='/forgotPassword/password' element={<FPpassword/>}></Route>


    <Route path='/otp' element={<Otp/>}></Route>
    <Route path='/success' element={<Success/>}></Route>
    <Route path='/RechargeSuccess' element={<SuccessRecharge/>}></Route>

    
    <Route path='/chat' element={<Chat/>}></Route>
    <Route path='/videocall/:userId' element={<VideoCall/>}></Route>



    <Route path='/contact' element={<Contact/>}></Route>
    <Route path='/services' element={<Services/>}></Route>
    <Route path='/users/profile/me' element={<ProtectedRoute allowedRoles={['patient']}><Myaccount/></ProtectedRoute>}></Route>
    <Route path='/doctors/profile/me' element={<ProtectedRoute allowedRoles={['doctor']}><Dashboard/></ProtectedRoute>}></Route>
    <Route path='/admin/login' element={<AdminLogin/>}></Route>
    <Route path='/admin/dashboard' element={<AdminDashboard/>}></Route>


    



  </Routes>
    
  
}

export default Routers