"use server";
import { readFileSync } from "fs";
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
        Object.keys(d).forEach((key) => {
          let include = d.SleepGoal == "sleep";
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
        Object.keys(d).forEach((key) => {
          let include = d.PhysGoal == "physical health";
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

  res.send(output);
}
