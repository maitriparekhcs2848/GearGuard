import { readDB, writeDB } from "../data/db";
import { v4 as uuid } from "uuid";

const FILE = "teams.json";

export const TeamService = {
  list() {
    return readDB<any[]>(FILE);
  },

  create(data: any) {
    const teams = readDB<any[]>(FILE);
    const team = {
      id: uuid(),
      createdAt: new Date(),
      activeRequests: 0,
      name: data.name || '',
      specialization: data.specialization || 'Mechanical',
      members: data.members || [],
      ...data
    };
    teams.push(team);
    writeDB(FILE, teams);
    return team;
  }
};
