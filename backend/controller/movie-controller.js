import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";

// Function to add a new movie
export const addMovie = async (req, res, next) => {
  let extractedToken;

  // Check if Authorization header is present
  if (req.headers.authorization) {
    extractedToken = req.headers.authorization.split(" ")[1];
  }

  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not Found" });
  }

  let adminId;

  // Verify token
  try {
    const decrypted = jwt.verify(extractedToken, process.env.SECRET_KEY);
    adminId = decrypted.id;
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }

  // Validate input data
  const { title, description, releaseDate, posterUrl, featured, actors, trailerUrl, seatLayout } = req.body;

  // Check for required fields
  if (
    !title || title.trim() === "" ||
    !description || description.trim() === "" ||
    !posterUrl || posterUrl.trim() === "" ||
    !seatLayout || !Array.isArray(seatLayout) === 0
  ) {
    return res.status(422).json({ message: "Invalid Inputs or Seat Layout" });
  }

  let movie;
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // Create new movie with seat layout
    movie = new Movie({
      title: title.trim(),
      description: description.trim(),
      releaseDate: new Date(releaseDate),
      posterUrl: posterUrl.trim(),
      featured,
      actors,
      trailerUrl: trailerUrl?.trim(),
      admin: adminId,
      seatLayout, // Save the seat layout
    });

    const adminUser = await Admin.findById(adminId);
    if (!adminUser) {
      throw new Error("Admin user not found");
    }

    adminUser.addedMovies.push(movie);
    await movie.save({ session });
    await adminUser.save({ session });

    await session.commitTransaction();
    session.endSession();

  } catch (err) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    return res.status(500).json({ message: "Failed to add movie", error: err.message });
  }

  return res.status(201).json({ message : "success" });
};

// Function to get all movies
export const getAllMovies = async (req, res, next) => {
  let movies;
  try {
    movies = await Movie.find();
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch movies", error: err.message });
  }

  if (!movies || movies.length === 0) {
    return res.status(404).json({ message: "No movies found" });
  }

  return res.status(200).json({ movies });
};

// Function to get movie details by ID
export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch movie", error: err.message });
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }

  return res.status(200).json({ movie });
};

// Function to get the seat layout for a specific movie
export const getSeatLayout = async (req, res, next) => {
  const movieId = req.params.movieId;
  let movie;
  try {
    movie = await Movie.findById(movieId, "seatLayout");
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch seat layout", error: err.message });
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }

  return res.status(200).json({ seatLayout: movie.seatLayout });
};

// Function to update seat status for a specific movie
export const updateSeatStatus = async (req, res, next) => {
  const movieId = req.params.movieId;
  const { seatNumber } = req.body;

  if (!seatNumber) {
    return res.status(400).json({ message: "Seat number is required" });
  }

  let movie;
  try {
    movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Find the seat and update its status
    const seat = movie.seatLayout.find((s) => s.number === seatNumber);
    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    if (seat.booked) {
      return res.status(400).json({ message: "Seat is already booked" });
    }

    seat.booked = true;
    await movie.save();

  } catch (err) {
    return res.status(500).json({ message: "Failed to update seat status", error: err.message });
  }

  return res.status(200).json({ message: "Seat booked successfully", seatLayout: movie.seatLayout });
};
