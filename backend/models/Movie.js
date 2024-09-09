
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  posterUrl: { type: String, required: true },
  trailerUrl: { type: String }, // Add this line for the trailer URL
  featured: { type: Boolean, required: true },
  actors: [{ type: String, required: true }],
  admin: { type: mongoose.Types.ObjectId, ref: "Admin", required: true },
});

export default mongoose.model("Movie", movieSchema);
