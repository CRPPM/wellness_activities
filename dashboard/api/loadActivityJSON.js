import { readFileSync } from "fs";
import path from "path";

export default function handler(req, res) {
  const file = path.join(process.cwd(), "data", "activities.json");
  const stringified = readFileSync(file, "utf8");
  const data = JSON.parse(stringified)["data"];

  res.send(data);
}
