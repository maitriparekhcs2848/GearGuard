// routes/user.routes.ts
import { Router } from "express";
import { UserService } from "../services/user.service";
import { apiResponse } from "../utils/response";
import jwt from "jsonwebtoken";

const r = Router();

r.post("/signup", async (req, res) => {
  try {
    const user = await UserService.create(req.body);
    const token = jwt.sign({ id: user.id }, "your-secret-key", { expiresIn: "7d" });
    res.json(apiResponse({ user, token }));
  } catch (error: any) {
    res.status(400).json(apiResponse(null, error.message));
  }
});

r.post("/login", async (req, res) => {
  try {
    const user = await UserService.authenticate(req.body.email, req.body.password);
    const token = jwt.sign({ id: user.id }, "your-secret-key", { expiresIn: "7d" });
    res.json(apiResponse({ user, token }));
  } catch (error: any) {
    res.status(401).json(apiResponse(null, error.message));
  }
});

export default r;