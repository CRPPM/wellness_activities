"use server";
import { readFileSync } from "fs";
import path from "path";

export default function handler(req, res) {
  const { goal } = req.body;
  const file = path.join(process.cwd(), "dashboard", "data", "activities.json");
  const stringified = readFileSync(file, "utf8");
  let data = JSON.parse(stringified)["data"];
  console.log(data[0].EmoBreaths);
  console.log(data[0].EmoBreathsFreqW);
  console.log(data[0].EmoBreathsTimeW);

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
      break;
    case "Productivity":
      data = data.filter(function (d) {
        let include = d.ProductGoal == "productivity";
        Object.keys(d).forEach((key) => {
          if (d[key] === null) {
            delete d[key];
          }
        });
        return include;
      });
      break;
    case "Social Wellness":
      data = data.filter(function (d) {
        let include = d.SocialGoal == "social wellness";
        Object.keys(d).forEach((key) => {
          if (d[key] === null) {
            delete d[key];
          }
        });
        return include;
      });
      break;
  }

  res.send(data);
}
