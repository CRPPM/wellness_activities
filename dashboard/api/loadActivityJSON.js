"use server";
import { readFileSync } from "fs";
import path from "path";

export default function handler(req, res) {
  console.log("hello?");
  const file = path.join(process.cwd(), "dashboard", "data", "activities.json");
  const stringified = readFileSync(file, "utf8");
  const data = JSON.parse(stringified)["data"];
  console.log(data);
  res.send(data);
}
