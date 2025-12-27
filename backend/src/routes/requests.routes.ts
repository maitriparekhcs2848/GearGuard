// routes/requests.routes.ts
import { Router } from "express";
import { RequestService } from "../services/requests.service";
import { apiResponse } from "../utils/response";

const r = Router();

r.get("/", (_, res) => res.json(apiResponse(RequestService.list())));
r.post("/", (req, res) => res.json(apiResponse(RequestService.create(req.body))));
r.put("/:id", (req, res) =>
  res.json(apiResponse(RequestService.update(req.params.id, req.body)))
);
r.patch("/:id/status", (req, res) =>
  res.json(apiResponse(
    RequestService.updateStatus(req.params.id, req.body.status, (req as any).user.id)
  ))
);

export default r;
