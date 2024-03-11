"use server";
import { readFileSync } from "fs";
import { pako } from "pako";
import path from "path";

export default function handler(req, res) {
  const { goal } = req.body;
  const file = path.join(process.cwd(), "dashboard", "data", "activities.json");
  const stringified = readFileSync(file, "utf8");
  let data = JSON.parse(stringified)["data"];
  console.log("hey");
  console.log(data[0].BFIExtraHi);
  let goalPrefix = "";
  switch (goal) {
    case "Sleep":
      data = data.filter(function (d) {
        return d.SleepGoal == "sleep";
      });
      goalPrefix = "Sleep";
      break;
    case "Physical Health":
      data = data.filter(function (d) {
        return d.PhysGoal == "physical health";
      });
      goalPrefix = "Phys";
      break;
    case "Emotional Health":
      data = data.filter(function (d) {
        return d.EmoGoal == "emotional health";
      });
      goalPrefix = "Emo";
      break;
    case "Productivity":
      data = data.filter(function (d) {
        return d.ProductGoal == "productivity";
      });
      goalPrefix = "Product";
      break;
    case "Social Wellness":
      data = data.filter(function (d) {
        return d.SocialGoal == "social wellness";
      });
      goalPrefix = "Social";
      break;
  }
  console.log("hey2");
  console.log(data[0].BFIExtraHi);
  output = pako.deflate(data);
  res.send(data);
}
