import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  seatNumber: {
    type: String, // Changed to String to match "A1", "B1", etc.
    required: true,
    validate: {
      validator: function (seat) {
        // Regex to validate alphanumeric seat numbers (e.g., A1, B10)
        return /^[A-Z]\d{1,2}$/.test(seat);
      },
      message: (props) => ${props.value} is not a valid seat number!,
    },
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Booking", bookingSchema);
