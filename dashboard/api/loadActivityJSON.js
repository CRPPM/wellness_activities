"use server";
import { readFileSync } from "fs";
import path from "path";

export default function handler(req, res) {
  console.log("hello?");
  console.log(process.cwd(), "data", "activities.json");
  console.log(path.join("data", "activities.json"));
  const file = path.join("data", "activities.json");
  const stringified = readFileSync(file, "utf8");
  const data = JSON.parse(stringified)["data"];

  res.send(data);
}
