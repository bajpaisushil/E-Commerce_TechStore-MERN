const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();
const { Server } = require("socket.io");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const connectToDb = require("./connection");
connectToDb();
const io = new Server(server, {
  cors: "*",
  methods: "*",
});

const User = require("./models/user");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const imageRoutes = require("./routes/imageRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/images", imageRoutes);
app.use("/orders", orderRoutes);

app.post("/create-payment", async (req, res) => {
  const { amount } = req.body;
  console.log(amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      description: 'description', // Include the description here
      payment_method_types: ["card"],
    });
    console.log(paymentIntent);
    res.status(200).json(paymentIntent);
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
  }
});

server.listen(8000, () => {
  console.log(`Server running on port `, 8000);
});

app.set('socketio', io);
