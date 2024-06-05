import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users/auth", authRoutes);
app.use("/api/users/profile", profileRoutes);

export default app;
