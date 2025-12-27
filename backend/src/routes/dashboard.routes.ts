// routes/dashboard.routes.ts
import { Router } from "express";
import { readDB } from "../data/db";
import { apiResponse } from "../utils/response";

const r = Router();

r.get("/", (_, res) => {
  const equipment = readDB<any[]>("equipment.json");
  const requests = readDB<any[]>("requests.json");

  res.json(apiResponse({
    totalEquipment: equipment.length,
    activeRequests: requests.filter(r => r.status !== "REPAIRED").length,
    completedRequests: requests.filter(r => r.status === "REPAIRED").length,
    requestsByStatus: requests.reduce((acc: any, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {})
  }));
});

export default r;
