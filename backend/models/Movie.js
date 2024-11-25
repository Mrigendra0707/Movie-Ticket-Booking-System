const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  posterUrl: { type: String, required: true },
  trailerUrl: { type: String }, 
  featured: { type: Boolean, required: true },
  actors: [{ type: String, required: true }],
  admin: { type: mongoose.Types.ObjectId, ref: "Admin", required: true },
  seatLayout: [
    {
      number: { type: Number, required: true },
      booked: { type: Boolean, required: true },
    },
  ],
});

export default mongoose.model("Movie", movieSchema);
