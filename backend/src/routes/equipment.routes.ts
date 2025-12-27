// routes/equipment.routes.ts
import { Router } from "express";
import { EquipmentService } from "../services/equipment.service";
import { apiResponse } from "../utils/response";

const r = Router();

r.get("/", (_, res) => res.json(apiResponse(EquipmentService.list())));
r.post("/", (req, res) => res.json(apiResponse(EquipmentService.create(req.body))));
r.put("/:id", (req, res) =>
  res.json(apiResponse(EquipmentService.update(req.params.id, req.body)))
);
r.delete("/:id", (req, res) => {
  EquipmentService.delete(req.params.id);
  res.json(apiResponse(null, "Deleted"));
});

export default r;
