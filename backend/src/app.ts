import express from "express";
import cors from "cors";

import equipmentRoutes from "./routes/equipment.routes";
import teamRoutes from "./routes/teams.routes";
import requestRoutes from "./routes/requests.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./utils/errors";
import { authenticate } from "./middleware/auth";

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/users", userRoutes);

// Protected routes
app.use("/api/equipment", authenticate, equipmentRoutes);
app.use("/api/teams", authenticate, teamRoutes);
app.use("/api/requests", authenticate, requestRoutes);
app.use("/api/dashboard", authenticate, dashboardRoutes);

app.use(errorHandler);

export default app;
