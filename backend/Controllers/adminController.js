import Admin from "../models/AdminSchema.js";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import Service from "../models/ServiceSchema.js";
import jwt from "jsonwebtoken";




const generateAdminToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY_ADMIN,
    {
      expiresIn: "15d",
    }
  );
};
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    

    if (admin) {
      
      if (password === admin.password) {
        const admin_token = generateAdminToken(admin);
        res.status(200).json({  status: true,
          message: "successfully login",
          token: admin_token,
          data: admin, });
      } else {
        // Passwords do not match
        res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      // Admin not found
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res
      .status(200)
      .json({ success: true, message: "Users found", data: users });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};
export const getAllDoctor = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select("-password");
    res
      .status(200)
      .json({ success: true, message: "Users found", data: doctors });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};
export const handleBlock = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (user.isBlocked == true) {
      user.isBlocked = false;
      await user.save();
    } else {
      user.isBlocked = true;
      await user.save();
    }
    res.status(201).json({ message: "Success" });
  } catch (error) {}
};
export const handleBlockDoctors = async (req, res) => {
  try {
    const id = req.params.id;

    const doctor = await Doctor.findById(id);

    if (doctor.isBlocked == true) {
      doctor.isBlocked = false;
      await doctor.save();
    } else {
      doctor.isBlocked = true;
      await doctor.save();
    }
    res.status(201).json({ message: "Success" });
  } catch (error) {
    console.log(error);
  }
};
export const handleApproval = async (req, res) => {
  try {
    const id = req.params.id;

    const doctor = await Doctor.findById(id);

    if (doctor.certificateApprove == true) {
      doctor.certificateApprove = false;
      await doctor.save();
    } else {
      doctor.certificateApprove = true;
      await doctor.save();
    }
    res.status(201).json({ message: "Success" });
  } catch (error) {}
};
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("doctorId", "name") // Populate the doctor's name
      .populate("patientId", "name"); // Populate the patient's name

    if (bookings.length > 0) {
      res
        .status(200)
        .json({ success: true, message: "Bookings found", data: bookings });
    } else {
      res.status(404).json({ success: false, message: "No bookings found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default adminLogin;
//service
export const addService = async (req, res) => {
  try {
    let { serviceName, serviceDescription } = req.body;

    serviceName = serviceName.toUpperCase();

    const existingService = await Service.findOne({ serviceName });

    if (existingService) {
      return res.status(400).json({ message: "Service already exists" });
    }

    const newService = new Service({
      serviceName,
      serviceDescription,
    });

    const savedService = await newService.save();

    res.status(201).json(savedService);
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ error: "Failed to add service" });
  }
};
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find(); // Fetch all services

    res.status(200).json({ services });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

export const updateService = async (req, res) => {
  const { id } = req.params;
  const { isListed } = req.body;

  try {
    // Check if the service exists
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Update the service with the new value of isListed
    service.isListed = isListed;
    await service.save();

    // Find all doctors with the specified specialization
    const doctors = await Doctor.find({ specialization: service.serviceName });

    // Update isListed field for each doctor
    for (const doctor of doctors) {
      doctor.isListed = isListed;
      await doctor.save();
    }

    res.status(200).json({
      message: "Service and associated doctors updated successfully",
      service,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: "Failed to update service" });
  }
};
//analytics//number of booking per day
export const bookingAppointmentPerDate = async (req, res) => {
  try {
    const data = await Booking.aggregate([
      { $match: { cancelStatus: { $ne: true } } },
      { $group: { _id: "$date", totalBookings: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    if (data.length > 0) {
      res.status(200).json({
        success: true,
        message: "Bookings per appointment date found",
        data,
      });
    } else {
      res.status(404).json({ success: false, message: "No bookings found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const countUsers = async (req, res) => {
  try {
    const data = await User.countDocuments();

    res.status(200).json({ success: true, message: "User count found", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const countDoctors = async (req, res) => {
  try {
    const data = await Doctor.countDocuments();

    res
      .status(200)
      .json({ success: true, message: "doctor count found", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const countServices = async (req, res) => {
  try {
    const data = await Service.countDocuments();

    res
      .status(200)
      .json({ success: true, message: "service count found", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const countrevenue = async (req, res) => {
  try {
    const data1 = await Booking.aggregate([
      { $match: { cancelStatus: { $ne: true } } },
      { $group: { _id: null, revenue: { $sum: "$fee" } } },
    ]);
    const data = data1[0].revenue;

    res.status(200).json({ success: true, message: "revenue found", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const bookingPerSpecialization = async (req, res) => {
  try {
    const data = await Booking.aggregate([
      { $match: { cancelStatus: { $ne: true } } },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $group: {
          _id: "$doctor.specialization",
          totalBookings: { $sum: 1 },
          totalFee: { $sum: "$fee" },
        },
      },
    ]);

    res
      .status(200)
      .json({ success: true, message: "booking count found", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const doctorsPerSpecialization = async (req, res) => {
  try {
    const data = await Doctor.aggregate([
      { $match: { isListed: true } },
      { $group: { _id: "$specialization", totalDoctors: { $sum: 1 } } },
    ]);

    res
      .status(200)
      .json({ success: true, message: "doctor count found", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
