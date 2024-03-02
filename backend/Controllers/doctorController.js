import Doctor from "../models/DoctorSchema.js";
import bcrypt from "bcryptjs";
import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";

export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    // Check if the new email already exists
    const existingDoctor = await Doctor.findOne({
      email: req.body.email,
      _id: { $ne: id },
    });
    const existingUser = await User.findOne({
      email: req.body.email,
      _id: { $ne: id },
    });
    if (existingDoctor || existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email already exists. Choose a different email.",
        });
    }

    // Hash the password before updating
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }

    const updateDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Successfully updated",
        data: updateDoctor,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};
export const deleteDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "failed to delete" });
  }
};
export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findById(id).select("-password");
    res
      .status(200)
      .json({ success: true, message: "User found", data: doctor });
  } catch (error) {
    res.status(404).json({ success: false, message: "No doctor found" });
  }
};
export const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query;

    // Get the specialization query parameter
    const { specialization } = req.query;

    let doctors;

    if (query) {
      // Filter doctors based on query and specialization if provided
      doctors = await Doctor.find({
        certificateApprove: true,
        isBlocked: false,
        isListed: true,
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
        // Filter by specialization if provided
        ...(specialization && { specialization }),
      }).select("-password");
    } else {
      // Fetch all doctors if no query is provided
      doctors = await Doctor.find({
        certificateApprove: true,
        isBlocked: false,
        isListed: true,
        // Filter by specialization if provided
        ...(specialization && { specialization }),
      }).select("-password");
    }

    res
      .status(200)
      .json({ success: true, message: "Doctors found", data: doctors });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

export const getDoctorProfile = async (req, res) => {
  const doctorId = req.params.id;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "doctor not found" });
    }
    const { password, ...rest } = doctor._doc;
    res
      .status(200)
      .json({
        success: true,
        message: "profile info is getting",
        data: { ...rest },
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "something went wrong,cannot get" });
  }
};
export const addDoctorExperience = async (req, res) => {
  const doctorId = req.params.id;

  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const { experiences } = req.body;

    if (
      !experiences ||
      !Array.isArray(experiences) ||
      experiences.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid experiences data" });
    }

    const newExperiences = experiences.map(
      ({ fromDate, toDate, hospitalName }) => ({
        fromDate: new Date(fromDate).toISOString(),
        toDate: new Date(toDate).toISOString(),
        hospitalName,
      })
    );

    // Filter out already existing experiences
    const uniqueExperiences = newExperiences.filter(
      (newExp) =>
        !doctor.experiences.some(
          (exp) =>
            new Date(exp.fromDate).toISOString() === newExp.fromDate &&
            new Date(exp.toDate).toISOString() === newExp.toDate &&
            exp.hospitalName === newExp.hospitalName
        )
    );

    if (uniqueExperiences.length > 0) {
      doctor.experiences.push(...uniqueExperiences);
      const updatedDoctor = await doctor.save();
      res
        .status(200)
        .json({
          success: true,
          message: "Experiences added successfully",
          data: updatedDoctor,
        });
    } else {
      res
        .status(200)
        .json({
          success: true,
          message: "No new experiences to add",
          data: doctor,
        });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add experiences" });
  }
};
export const removeDoctorExperience = async (req, res) => {
  const doctorId = req.params.id;

  const experienceIdToRemove = req.body.removedExperience;

  try {
    // Find the doctor by ID and update to pull the experience with the given ID
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { _id: doctorId },
      { $pull: { experiences: { _id: experienceIdToRemove } } },
      { new: true }
    );

    if (!updatedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Experience removed successfully",
        data: updatedDoctor,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to remove experience" });
  }
};
export const saveAvailability = async (req, res) => {
  const doctorId = req.params.id;
  const { selectedDate, selectedSlots } = req.body;

  try {
    // Find the doctor by ID
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Check if any of the selected slots for the specific date is already booked
    const existingBookings = await Booking.find({
      doctorId,
      date: new Date(selectedDate),
      slot: { $in: selectedSlots },
    });

    if (existingBookings.length > 0) {
      // Some slots are already booked, return a message
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Some selected slots are already booked,check your my bookings",
        });
    }

    // Check if the selected date already exists in the selectedDatesAndSlots array
    const existingDateIndex = doctor.selectedDatesAndSlots.findIndex(
      (item) => item.date.toISOString() === new Date(selectedDate).toISOString()
    );

    if (existingDateIndex !== -1) {
      // If the date exists, update the slots for that date
      doctor.selectedDatesAndSlots[existingDateIndex].slots = [
        ...doctor.selectedDatesAndSlots[existingDateIndex].slots,
        ...selectedSlots,
      ];
    } else {
      // If the date doesn't exist, create a new object
      doctor.selectedDatesAndSlots.push({
        date: new Date(selectedDate),
        slots: selectedSlots,
      });
    }

    // Save the updated doctor document
    const updatedDoctor = await doctor.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Availability saved successfully",
        data: updatedDoctor,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to save availability" });
  }
};

export const getAvailability = async (req, res) => {
  const doctorId = req.params.id;
  const selectedDate = req.params.date;

  try {
    // Find the doctor by ID
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Find availability for the specified date
    const availability = doctor.selectedDatesAndSlots.find(
      (item) => item.date.toISOString().split("T")[0] === selectedDate
    );

    if (!availability) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Availability not found for the specified date",
        });
    }

    // Fetch booked slots for the selected doctor and date
    const bookedSlots = await Booking.find({
      doctorId,
      date: new Date(selectedDate),
    });

    // Extract booked slot timings
    const bookedSlotTimings = bookedSlots.map((booking) => booking.slot);

    // Exclude booked slots from available slots
    const availableSlots = availability.slots.filter(
      (slot) => !bookedSlotTimings.includes(slot)
    );

    // Return the available slots for the specified date
    res
      .status(200)
      .json({
        success: true,
        message: "Availability retrieved successfully",
        data: availableSlots,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get availability" });
  }
};
