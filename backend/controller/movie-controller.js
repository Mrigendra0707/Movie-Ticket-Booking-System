
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";

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
  const { title, description, releaseDate, posterUrl, featured, actors, trailerUrl } = req.body;
  if (
    !title || title.trim() === "" ||
    !description || description.trim() === "" ||
    !posterUrl || posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  let session;

  try {
    session = await mongoose.startSession();  // Declare session outside the try block
    session.startTransaction();

    movie = new Movie({
      title: title.trim(),
      description: description.trim(),
      releaseDate: new Date(releaseDate),
      posterUrl: posterUrl.trim(),
      featured,
      actors,
      trailerUrl: trailerUrl?.trim(),  // Handle the trailer URL
      admin: adminId,
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

  return res.status(201).json({ movie });
};



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


