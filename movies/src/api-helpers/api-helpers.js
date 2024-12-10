import axios from "axios";

// Function to get all movies
export const getAllMovies = async () => {
  const res = await axios.get("/movie").catch((err) => console.log(err));

  if (!res || res.status !== 200) {
    return console.log("No Data");
  }

  const data = await res.data;
  return data;
};

// Function to authenticate a user
export const sendUserAuthRequest = async (data, signup) => {
  const res = await axios
    .post(`/user/${signup ? "signup" : "login"}`, {
      name: signup ? data.name : "",
      email: data.email,
      password: data.password,
    })
    .catch((err) => console.log(err));

  if (!res || (res.status !== 200 && res.status !== 201)) {
    console.log("Unexpected Error Occurred");
  }

  const resData = await res?.data;
  return resData;
};

// Function to authenticate an admin
export const sendAdminAuthRequest = async (data) => {
  const res = await axios
    .post("/admin/login", {
      email: data.email,
      password: data.password,
    })
    .catch((err) => console.log(err));

  if (!res || res.status !== 200) {
    return console.log("Unexpected Error");
  }

  const resData = await res?.data;
  return resData;
};

// Function to get movie details by ID
export const getMovieDetails = async (id) => {
  const res = await axios.get(`/movie/${id}`).catch((err) => console.log(err));
  if (!res || res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res?.data;
  return resData;
};

// Function to create a new booking
export const newBooking = async (data) => {
  const res = await axios
    .post("/booking", {
      movie: data.movie,
      seatNumber: data.seatNumber,
      date: data.date,
      user: localStorage.getItem("userId"),
    })
    .catch((err) => console.log(err));

  if (!res || res.status !== 201) {
    return console.log("Unexpected Error");
  }
  const resData = await res?.data;
  return resData;
};

// Function to get user bookings
export const getUserBooking = async () => {
  const id = localStorage.getItem("userId");
  const res = await axios
    .get(`/user/bookings/${id}`)
    .catch((err) => console.log(err));

  if (!res || res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res?.data;
  return resData;
};

// Function to delete a booking by ID
export const deleteBooking = async (id) => {
  const res = await axios
    .delete(`/booking/${id}`)
    .catch((err) => console.log(err));

  if (!res || res.status !== 200) {
    return console.log("Unexpected Error");
  }

  const resData = await res?.data;
  return resData;
};

// Function to get user details by ID
export const getUserDetails = async () => {
  const id = localStorage.getItem("userId");
  const res = await axios.get(`/user/${id}`).catch((err) => console.log(err));
  if (!res || res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res?.data;
  return resData;
};

// Function to add a new movie (with trailer URL)
export const addMovie = async (data) => {
  const res = await axios
    .post(
      "/movie",
      {
        title: data.title,
        description: data.description,
        releaseDate: data.releaseDate,
        posterUrl: data.posterUrl,
        trailerUrl: data.trailerUrl, // Add this field
        featured: data.featured,
        actors: data.actors,
        admin: localStorage.getItem("adminId"),
        seatLayout: data.seatLayout || [], // Add seat layout for the movie
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .catch((err) => alert(err));

  if (!res || res.status !== 201) {
    return alert("Unexpected Error Occurred");
  }

  const resData = await res?.data;
  return resData;
};

// Function to get admin details by ID
export const getAdminById = async () => {
  const adminId = localStorage.getItem("adminId");
  const res = await axios
    .get(`/admin/${adminId}`)
    .catch((err) => console.log(err));

  if (!res || res.status !== 200) {
    return console.log("Unexpected Error Occurred");
  }

  const resData = await res?.data;
  return resData;
};

// Function to get seat layout for a specific movie
export const getSeatLayout = async (movieId) => {
  const res = await axios
    .get(`/movie/${movieId}/seats`)
    .catch((err) => console.log(err));

  if (!res || res.status !== 200) {
    return console.log("Unexpected Error Occurred");
  }

  const resData = await res?.data;
  return resData;
};

// Function to update seat status (mark a seat as booked)
export const updateSeatStatus = async (movieId, seatNumber) => {
  const res = await axios
    .patch(`/movie/${movieId}/seats`, { seatNumber })
    .catch((err) => console.log(err));

  if (!res || res.status !== 200) {
    return console.log("Unexpected Error Occurred");
  }

  const resData = await res?.data;
  return resData;
};

// Food Ordering System

// Function to get all available food items
export const getFoodItems = async () => {
  const res = await axios.get("/food").catch((err) => console.log(err));

  if (!res || res.status !== 200) {
    return console.log("Error fetching food items");
  }

  const foodData = await res?.data;
  return foodData;
};

// Function to place an order for food
export const placeFoodOrder = async (seat, items) => {
  const res = await axios
    .post("/food/order", { seat, items })
    .catch((err) => console.log(err));

  if (!res || res.status !== 201) {
    return console.log("Error placing food order");
  }

  const orderData = await res?.data;
  return orderData;
};

// Function to get all food orders (admin side)
export const getFoodOrders = async () => {
  const res = await axios.get("/food/orders").catch((err) => console.log(err));

  if (!res || res.status !== 200) {
    return console.log("Error fetching food orders");
  }

  const ordersData = await res?.data;
  return ordersData;
};
