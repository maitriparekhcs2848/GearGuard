import { readDB, writeDB } from "../data/db";
import { validateTransition } from "../utils/lifecycle";
import { v4 as uuid } from "uuid";

const FILE = "requests.json";

export const RequestService = {
  list() {
    return readDB<any[]>(FILE);
  },

  create(data: any) {
    const equipment = readDB<any[]>("equipment.json")
      .find(e => e.id === data.equipmentId);

    if (!equipment || equipment.isScrap) {
      throw new Error("Invalid or scrapped equipment");
    }

    const requests = readDB<any[]>(FILE);

    const request = {
      id: uuid(),
      status: "New",
      createdAt: new Date(),
      updatedAt: new Date(),
      teamId: equipment.teamId || data.teamId || '',
      subject: data.subject || '',
      equipmentId: data.equipmentId,
      type: data.type || 'Corrective',
      scheduledDate: data.scheduledDate || new Date(),
      assignedTo: data.assignedTo || '',
      description: data.description || '',
      priority: data.priority || 'Medium',
      ...data
    };

    requests.push(request);
    writeDB(FILE, requests);

    equipment.maintenanceCount++;
    writeDB("equipment.json", readDB<any[]>("equipment.json"));

    return request;
  },

  updateStatus(id: string, status: string, userId?: string) {
    const requests = readDB<any[]>(FILE);
    const req = requests.find(r => r.id === id);
    if (!req) throw new Error("Request not found");

    const oldStatus = req.status;
    validateTransition(req.status, status);

    req.status = status;
    req.updatedAt = new Date();

    writeDB(FILE, requests);

    return req;
  },

  update(id: string, data: any) {
    const requests = readDB<any[]>(FILE);
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Request not found");

    requests[index] = { ...requests[index], ...data, updatedAt: new Date() };
    writeDB(FILE, requests);
    return requests[index];
  }
};
