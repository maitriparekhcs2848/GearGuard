import fs from "fs";
import path from "path";

const base = __dirname;

export const readDB = <T>(file: string): T => {
  return JSON.parse(
    fs.readFileSync(path.join(base, file), "utf-8")
  );
};

export const writeDB = (file: string, data: any) => {
  fs.writeFileSync(
    path.join(base, file),
    JSON.stringify(data, null, 2)
  );
};
