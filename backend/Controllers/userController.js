import User from "../models/UserSchema.js";
import bcrypt from "bcryptjs";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import Wallet from "../models/WalletSchema.js";
import Stripe from "stripe";

export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    // Check if the new email already exists
    const existingUser = await User.findOne({
      email: req.body.email,
      _id: { $ne: id },
    });
    const existingDoctor = await Doctor.findOne({
      email: req.body.email,
      _id: { $ne: id },
    });
    if (existingUser || existingDoctor) {
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

    const updateUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Successfully updated",
        data: updateUser,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

export const getSingleUser = async (req, res) => {
  const email = req.params.email;

  try {
    // Use findOne to find a user by email
    const user = await User.findOne({ email }).select("-password");

    if (user) {
      res
        .status(200)
        .json({ success: true, message: "User found", data: user });
    } else {
      res.status(404).json({ success: false, message: "No user found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
export const getUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    const { password, ...rest } = user._doc;
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

export const getMyAppointments = async (req, res) => {
  try {
  } catch (error) {}
};

export const getDoctorDetails = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Fetch doctor details
    const doctorDetails = await Doctor.findById(doctorId);

    if (!doctorDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found", data: null });
    }

    // Fetch booked slots for the selected doctor
    const bookedSlots = await Booking.find({ doctorId });

    // Remove booked slots from selectedDatesAndSlots
    bookedSlots.forEach((booking) => {
      const { date, slot } = booking;
      const dateSlotIndex = doctorDetails.selectedDatesAndSlots.findIndex(
        (ds) => ds.date.toString() === date.toString()
      );
      if (dateSlotIndex !== -1) {
        const slotIndex =
          doctorDetails.selectedDatesAndSlots[dateSlotIndex].slots.indexOf(
            slot
          );
        if (slotIndex !== -1) {
          doctorDetails.selectedDatesAndSlots[dateSlotIndex].slots.splice(
            slotIndex,
            1
          );
        }
      }
    });

    // Combine doctor details and booked slots
    const doctorData = {
      ...doctorDetails._doc,
      bookedSlots: bookedSlots.map((booking) => ({
        date: booking.date,
        slot: booking.slot,
      })),
    };

    // Save the updated doctorDetails
    await doctorDetails.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Doctor details retrieved successfully",
        data: doctorData,
      });
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const addFriend = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, age, gender } = req.body;

    if (!name || !age || !gender) {
      return res
        .status(400)
        .json({
          message: "Name, age, and gender are required for adding a friend.",
        });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the friend already exists in the user's friends array
    const existingFriend = user.friends.find(
      (friend) =>
        friend.name === name && friend.age === age && friend.gender === gender
    );

    if (existingFriend) {
      return res
        .status(400)
        .json({ message: "Friend with the same data already exists." });
    }

    user.friends.push({ name, age, gender });

    await user.save();

    res
      .status(200)
      .json({ message: "Friend added successfully.", user: user.friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const payment = async (req, res) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const selectedDate = new Date(req.body.selectedDate);
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `You are booking for ${req.body.selectedUserName}`,
              description: `At ${req.body.selectedSlot} on ${formattedDate}`,
            },
            unit_amount: req.body.fee * 100,
          },

          quantity: 1,
        },
      ],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US"], // Add other countries as needed
      },
      mode: "payment",
      success_url: "https://medicare.sayoojks.shop/success",
      cancel_url: "https://medicare.sayoojks.shop/cancel",
    });

    // Send the session ID back to the client
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//wallet
export const getWalletHistoryByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const walletHistory = await Wallet.find({ userId }).sort({ createdAt: 1 });

    if (!walletHistory) {
      return res
        .status(404)
        .json({ message: "Wallet history not found for the user" });
    }

    res.status(200).json(walletHistory);
  } catch (error) {
    console.error("Error retrieving wallet history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//recharge
export const recharge = async (req, res) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const rechargeAmount = req.body.rechargeAmount;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Recharge", // Set a name for the product
              description: `Recharge for ${rechargeAmount}`, // Include recharge amount in description
            },
            unit_amount: rechargeAmount * 100, // Convert recharge amount to smallest currency unit (e.g., cents)
          },
          quantity: 1,
        },
      ],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US"], // Add other countries as needed
      },
      mode: "payment",
      success_url: "https://medicare.sayoojks.shop/RechargeSuccess",
      cancel_url: "https://medicare.sayoojks.shop/cancel",
    });

    // Send the session ID back to the client
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const findMostRecentWallet = async (req, res) => {
  const userId = req.params.id;

  try {
    const mostRecentWallet = await Wallet.findOne({ userId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!mostRecentWallet) {
      return res.status(404).json({ message: "No wallet found for this user" });
    }

    return res.status(200).json({ data: mostRecentWallet });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to find the most recent wallet" });
  }
};
