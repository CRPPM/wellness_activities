"use server";
import { readFileSync } from "fs";
import path from "path";

export default function handler(req, res) {
  const { goal } = req.body;
  const file = path.join(process.cwd(), "dashboard", "data", "activities.json");
  const stringified = readFileSync(file, "utf8");
  let data = JSON.parse(stringified)["data"];

  let goalPrefix = "";
  switch (goal) {
    case "Sleep":
      data = data.filter(function (d) {
        let include = d.SleepGoal == "sleep";
        Object.keys(d).forEach((key) => {
          if (d[key] === null) {
            delete d[key];
          }
        });
        return include;
      });
      goalPrefix = "Sleep";
      break;
    case "Physical Health":
      data = data.filter(function (d) {
        let include = d.PhysGoal == "physical health";
        Object.keys(d).forEach((key) => {
          if (d[key] === null) {
            delete d[key];
          }
        });
        return include;
      });
      goalPrefix = "Phys";
      break;
    case "Emotional Health":
      data = data.filter(function (d) {
        let include = d.EmoGoal == "emotional health";
        Object.keys(d).forEach((key) => {
          if (d[key] === null) {
            delete d[key];
          }
        });
        return include;
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

  res.send(data);
}
