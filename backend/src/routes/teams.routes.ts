// routes/teams.routes.ts
import { Router } from "express";
import { TeamService } from "../services/teams.service";
import { apiResponse } from "../utils/response";

const r = Router();

r.get("/", (_, res) => res.json(apiResponse(TeamService.list())));
r.post("/", (req, res) => res.json(apiResponse(TeamService.create(req.body))));

export default r;
