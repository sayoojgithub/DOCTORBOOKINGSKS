import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";
import Wallet from "../models/WalletSchema.js";
export const createBooking = async (req, res) => {
  try {
    const { patientId, doctorId, date, slot, bookedFor, fee } = req.body;

    const newBooking = new Booking({
      patientId,
      doctorId,
      date,
      slot,
      bookedFor,
      fee,
    });

    const savedBooking = await newBooking.save();

    res.status(200).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const createBookingWithWallet = async (req, res) => {
  try {
    const { patientId, doctorId, date, slot, bookedFor, fee } = req.body;

    const newBooking = new Booking({
      patientId,
      doctorId,
      date,
      slot,
      bookedFor,
      fee,
    });

    const savedBooking = await newBooking.save();
    const patientWallet = await Wallet.findOne({ userId: patientId })
      .sort({ createdAt: -1 })
      .exec();
    let existingamount = patientWallet ? patientWallet.currentWalletAmount : 0;
    const newWallet = new Wallet({
      userId: patientId,
      transactionType: "debit",
      amount: fee,
      currentWalletAmount: existingamount - fee,
    });

    // Save the wallet
    await newWallet.save();

    res.status(200).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Find the last booking for the specified user_id
    const lastBooking = await Booking.findOne({ patientId: user_id })
      .sort({ $natural: -1 }) // Sort by natural order (latest first)
      .exec();

    if (!lastBooking) {
      return res
        .status(404)
        .json({ error: "No bookings found for the specified user_id" });
    }

    // Update the paymentStatus to true
    lastBooking.paymentStatus = true;

    // Save the updated booking
    const updatedBooking = await lastBooking.save();

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const patientBooking = async (req, res) => {
  try {
    const { user_id } = req.query;

    // Find all bookings for the specified user_id
    const patientBookings = await Booking.find({ patientId: user_id }).exec();

    // Fetch doctors' names corresponding to their unique doctorIds
    const bookingsWithDoctors = await Promise.all(
      patientBookings.map(async (booking) => {
        const doctor = await Doctor.findById(booking.doctorId).exec();
        const doctorName = doctor ? doctor.name : "Unknown Doctor"; // Handle gracefully if doctor not found
        return { ...booking._doc, doctorName }; // Append doctorName to each booking
      })
    );

    res.status(200).json(bookingsWithDoctors);
  } catch (error) {
    console.error("Error fetching patient bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const doctorBooking = async (req, res) => {
  try {
    const { doctor_id } = req.query;

    // Find all bookings for the specified doctor_id
    const doctorBookings = await Booking.find({ doctorId: doctor_id }).exec();

    // Fetch patients' names corresponding to their unique patientIds
    const bookingsWithPatients = await Promise.all(
      doctorBookings.map(async (booking) => {
        const patient = await User.findById(booking.patientId).exec();
        const patientName = patient ? patient.name : "Unknown Patient"; // Handle gracefully if patient not found
        return { ...booking._doc, patientName }; // Append patientName to each booking
      })
    );

    res.status(200).json(bookingsWithPatients);
  } catch (error) {
    console.error("Error fetching doctor bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Assuming you have imported Wallet Schema and defined cancelBookingDoctor function

export const cancelBookingDoctor = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const cancelledBy = req.body.cancelledBy;

    const booking = await Booking.findById(bookingId).exec();

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.cancelStatus = true;
    booking.cancelledBy = cancelledBy;

    const updatedBooking = await booking.save();

    if (cancelledBy === "doctor") {
      const patientId = booking.patientId;
      const patientWallet = await Wallet.findOne({ userId: patientId })
        .sort({ createdAt: -1 })
        .exec();
      let existingamount = patientWallet
        ? patientWallet.currentWalletAmount
        : 0;

      const newWallet = new Wallet({
        userId: patientId,
        transactionType: "credit",
        cancelledBy: cancelledBy,
        amount: booking.fee,
        currentWalletAmount: existingamount + booking.fee,
      });

      // Save the wallet
      await newWallet.save();
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const cancelBookingPatient = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancelledBy } = req.body;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId).exec();

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update the cancelStatus to true and set cancelledBy
    booking.cancelStatus = true;
    booking.cancelledBy = cancelledBy;

    // Save the updated booking
    const updatedBooking = await booking.save();
    if (cancelledBy === "patient") {
      const patientId = booking.patientId;
      const patientWallet = await Wallet.findOne({ userId: patientId })
        .sort({ createdAt: -1 })
        .exec();
      let existingamount = patientWallet
        ? patientWallet.currentWalletAmount
        : 0;

      const newWallet = new Wallet({
        userId: patientId,
        transactionType: "credit",
        cancelledBy: cancelledBy,
        amount: booking.fee,
        currentWalletAmount: existingamount + booking.fee,
      });

      // Save the wallet
      await newWallet.save();
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//walletrecharge
export const createWallet = async (req, res) => {
  const { userId, rechargeAmount } = req.body;

  const patientWallet = await Wallet.findOne({ userId: userId })
    .sort({ createdAt: -1 })
    .exec();

  let existingamount = patientWallet ? patientWallet.currentWalletAmount : 0;

  try {
    const wallet = new Wallet({
      userId: userId,
      transactionType: "credit",
      amount: rechargeAmount,
      currentWalletAmount: existingamount + rechargeAmount,
    });

    // Save wallet details
    await wallet.save();

    // Send 200 response indicating successful recharge
    res.status(200).json({ message: "Recharge Successful" });
  } catch (error) {
    console.error("Error:", error);
    // Send 500 response indicating failure
    res.status(500).json({ error: "Recharge Failed" });
  }
};
export const rescheduleBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    // Find the booking using the booking ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Find the doctor associated with the booking
    const doctor = await Doctor.findById(booking.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Extract the booking date and rescheduled slot
    const bookingDate = new Date(booking.date);
    const rescheduledSlot = booking.rescheduleSlot;

    // Find all bookings for the doctor on the same date
    const doctorBookings = await Booking.find({
      doctorId: doctor._id,
      date: { $eq: bookingDate }
    });

    // Collect all booked slots and rescheduled slots
    const bookedSlots = [];
    const rescheduledSlots = [];
    doctorBookings.forEach(booking => {
      bookedSlots.push(booking.slot);
      if (booking.rescheduleStatus && booking.rescheduleSlot) {
        rescheduledSlots.push(booking.rescheduleSlot);
      }
    });

    // Get doctor's configured slots for the date of the booking
    const selectedDateAndSlots = doctor.selectedDatesAndSlots.find(selectedDate => {
      const selectedSlotDate = new Date(selectedDate.date);
      return selectedSlotDate.toDateString() === bookingDate.toDateString();
    });

    if (!selectedDateAndSlots) {
      return res.status(404).json({ message: "No available slots for the booking date" });
    }

    // Filter out the slots that are not booked and not equal to the rescheduled slot
    let slotsNotBooked = selectedDateAndSlots.slots.filter(slot => !bookedSlots.includes(slot) && !rescheduledSlots.includes(slot));

    res.status(200).json({ slotsNotBooked });
  } catch (error) {
    console.error("Error rescheduling booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};





export const updateBookingReschedule = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rescheduledSlot } = req.body;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking details
    booking.rescheduleStatus = true;
    booking.rescheduleSlot = rescheduledSlot;
    booking.updatedAt = new Date(); // Update updatedAt timestamp

    // Save the updated booking
    await booking.save();

    // Send success response
    res.status(200).json({ message: 'Booking rescheduled successfully', booking });
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




