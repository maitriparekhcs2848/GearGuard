import { readDB, writeDB } from "../data/db";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

const FILE = "users.json";

// Initialize users file if it doesn't exist
try {
  readDB<any[]>(FILE);
} catch {
  writeDB(FILE, []);
}

export const UserService = {
  async create(data: { email: string; password: string; name: string }) {
    const users = readDB<any[]>(FILE);
    
    // Check if user already exists
    if (users.find(u => u.email === data.email)) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = {
      id: uuid(),
      email: data.email,
      password: hashedPassword,
      name: data.name,
      createdAt: new Date(),
    };

    users.push(user);
    writeDB(FILE, users);
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async authenticate(email: string, password: string) {
    const users = readDB<any[]>(FILE);
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  findById(id: string) {
    const users = readDB<any[]>(FILE);
    const user = users.find(u => u.id === id);
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};