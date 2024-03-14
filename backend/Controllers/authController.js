import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateOTP, sendOTPEmail } from "../Utils/otp.js";
const generateDoctorToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY_DOCTOR,
    {
      expiresIn: "15d",
    }
  );
};
const generatePatientToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY_PATIENT,
    {
      expiresIn: "15d",
    }
  );
};
export const otp = async (req, res) => {
  const email = req.params.email;

  const otp = generateOTP();

  sendOTPEmail(email, otp);
  res.status(200).json({ data: otp });
};

export const fpOtp = async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    // const doctor=await Doctor.findOne({email})

    if (user || doctor) {
      const otp = generateOTP();
      console.log(otp)

      sendOTPEmail(email, otp);
      res.status(200).json({ data: otp });
    } else {
      // Handle the case where neither user nor doctor is found
      res
        .status(404)
        .json({ message: "User or doctor not found for the given email" });
    }
  } catch (error) {
    console.log(error.message);
    //res.status(403).json({message:'invalid email'})
  }
};

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;

  try {
    let user = null;
    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exist with same email..." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }
    if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User successfully created" });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ success: false, message: "internal server error,Try again" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('haiiiiii')
  try {
    let user = null;
    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });
    if (patient) {
      user = patient;
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        if (user.isBlocked) {
          // User is blocked
          return res
            .status(403)
            .json({ status: false, message: "User is blocked by admin" });
        }
        const patient_token = generatePatientToken(user);
        res
          .status(200)
          .json({
            status: true,
            message: "successfully login",
            token: patient_token,
            data: patient,
          });
      } else {
        return res
          .status(400)
          .json({ status: false, message: "invalide credentials" });
      }
    }

    if (doctor) {
      user = doctor;
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        if (user.isBlocked) {
          // User is blocked
          return res
            .status(403)
            .json({ status: false, message: "User is blocked by admin" });
        }
        const doctor_token = generateDoctorToken(user);
        res
          .status(200)
          .json({
            status: true,
            message: "successfully login",
            token: doctor_token,
            data: doctor,
          });
      } else {
        return res
          .status(400)
          .json({ status: false, message: "invalide credentials" });
      }
    }
    if (!user) {
      return res.status(404).json({ message: "check the email and password" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "failed to login" });
  }
};

export const changepassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await Doctor.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "Check the email and password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user.password = hashPassword;

    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
