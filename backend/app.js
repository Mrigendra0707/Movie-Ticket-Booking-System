import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user-router.js";
import adminRouter from "./routes/admin-router.js";
import movieRouter from "./routes/movie-router.js";
import bookingsRouter from "./routes/booking-router.js";
import Order from './models/order.js'; // Updated

dotenv.config();

if (!process.env.MONGODB_PASSWORD) {
  console.error("MONGODB_PASSWORD environment variable is missing.");
  process.exit(1);
}

const app = express(); 
const PORT = process.env.PORT || 5000;
const QueryFile = "./Query.json";
const ServicesFile = "./Services.json";
const FoodItemsFile = "./FoodItems.json"; 
 
// Utility functions
const readDatabase = (databasePath) => {
  try {
    if (!fs.existsSync(databasePath)) {
      fs.writeFileSync(databasePath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(databasePath, "utf-8"));
  } catch (error) {
    console.error(`Error reading database at ${databasePath}:`, error);
    return [];
  }
};

const writeDatabase = (databasePath, data) => {
  try {
    fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to database at ${databasePath}:`, error);
  }
};

// Middlewares
app.use(cors());
app.use(express.json());

// Routers
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);

// Food API Endpoints
app.get("/food", (req, res) => {
  const foodMenu = readDatabase(FoodItemsFile);
  return res.status(200).json(foodMenu);
});

app.post("/food", (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required." });
  }

  const foodMenu = readDatabase(FoodItemsFile);
  const newFoodItem = { id: Date.now(), name, price };
  foodMenu.push(newFoodItem);

  writeDatabase(FoodItemsFile, foodMenu);
  return res.status(201).json({
    message: "Food item added successfully.",
    foodItem: newFoodItem,
  });
});

// Order API Endpoints
app.post("/order", async (req, res) => {
  console.log("Enterd")
  try {
    const { cartItems, customerName, customerEmail ,seatNumber} = req.body;
    const order = new Order({ cartItems, customerName, customerEmail,seatNumber });
    await order.save();
    res.status(200).json({ message: "Order placed successfully!", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to place the order.", error });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders.", error });
  }
});

// MongoDB Connection
mongoose
  .connect(
    `mongodb+srv://mrigendra1941be22:${process.env.MONGODB_PASSWORD}@cluster0.xqxhs.mongodb.net/`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Connected to Database and Server is running on port ${PORT}`)
    );
  })
  .catch((error) => console.error("Database connection error:", error));
