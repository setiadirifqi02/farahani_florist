import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoute from "./routes/payment.js";

import { connectDatabase } from "./config/dbConnection.js";
import errorMiddleware from "./middleware/errors.js";

const app = express();

// Uncaught Exception handler
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});

dotenv.config({ path: "backend/config/config.env" });

// connecting to MongoDb database
connectDatabase();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// app.use(helmet.hidePoweredBy());

// app.use(helmet.frameguard({ action: "deny" }));

// app.use(helmet.xssFilter());

// app.use(helmet.ieNoOpen());

// app.use(helmet.hsts());

// app.use(helmet.noSniff());

// Products routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoute);

app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on Port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

// Unhandle Promise rejection handler
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to Unhandle Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
