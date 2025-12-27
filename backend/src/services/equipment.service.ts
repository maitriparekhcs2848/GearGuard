import { readDB, writeDB } from "../data/db";
import { v4 as uuid } from "uuid";

const FILE = "equipment.json";

export const EquipmentService = {
  list() {
    return readDB<any[]>(FILE);
  },

  create(data: any) {
    const equipment = readDB<any[]>(FILE);
    const item = {
      id: uuid(),
      createdAt: new Date(),
      maintenanceCount: 0,
      isScrap: false,
      name: data.name || '',
      serialNumber: data.serialNumber || 'N/A',
      category: data.category || 'Machinery',
      department: data.department || 'Production',
      teamId: data.teamId || '',
      location: data.location || '',
      purchaseDate: data.purchaseDate || new Date(),
      warrantyExpiry: data.warrantyExpiry || new Date(),
      condition: data.condition || 'Good',
      usageHours: data.usageHours || 0,
      healthScore: data.healthScore || 100,
      assignedEmployee: data.assignedEmployee || '',
      ...data
    };
    equipment.push(item);
    writeDB(FILE, equipment);
    return item;
  },

  update(id: string, data: any) {
    const equipment = readDB<any[]>(FILE);
    const index = equipment.findIndex(e => e.id === id);
    if (index === -1) throw new Error("Equipment not found");
    equipment[index] = { ...equipment[index], ...data };
    writeDB(FILE, equipment);
    return equipment[index];
  },

  delete(id: string) {
    writeDB(FILE, readDB<any[]>(FILE).filter(e => e.id !== id));
  }
};
