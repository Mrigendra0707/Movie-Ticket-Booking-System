import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

// Define the valid seat layout
const rows = [
  "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11",
  "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11",
  "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11",
  "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11",
  "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10", "E11",
  "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11",
  "G1",
];

export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user } = req.body;

  // Validate seat number
  if (!rows.includes(seatNumber)) {
    return res.status(400).json({ message: "Invalid seat number" });
  }

  let existingMovie;
  let existingUser;

  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching movie or user" });
  }

  if (!existingMovie) {
    return res.status(404).json({ message: "Movie not found with the given ID" });
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User not found with the given ID" });
  }

  // Ensure bookings arrays are initialized
  if (!existingUser.bookings) {
    existingUser.bookings = [];
  }
  if (!existingMovie.bookings) {
    existingMovie.bookings = [];
  }

  // Check if the seat is already booked
  const isSeatBooked = await Bookings.findOne({ movie, seatNumber, date: new Date(date) });
  if (isSeatBooked) {
    return res.status(400).json({ message: "Seat already booked for this movie and date" });
  }

  let booking;

  try {
    booking = new Bookings({
      movie,
      date: new Date(date),
      seatNumber,
      user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);

    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });

    await session.commitTransaction();
  } catch (err) {
    return res.status(500).json({ message: "Error creating booking" });
  }

  return res.status(201).json({ booking });
};

export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;

  try {
    booking = await Bookings.findById(id).populate("user movie");
  } catch (err) {
    return res.status(500).json({ message: "Error fetching booking" });
  }

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  return res.status(200).json({ booking });
};

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  let booking;

  try {
    booking = await Bookings.findByIdAndRemove(id).populate("user movie");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);

    await booking.movie.save({ session });
    await booking.user.save({ session });

    await session.commitTransaction();
  } catch (err) {
    return res.status(500).json({ message: "Error deleting booking" });
  }

  return res.status(200).json({ message: "Successfully deleted booking" });
};
