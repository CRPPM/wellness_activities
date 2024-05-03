"use server";
import { readFileSync } from "fs";
import path from "path";

// process data
function calc_rbo(data, selectedDemo) {
  console.log("hi");
  console.log(data);
  console.log(selectedDemo);
}

export default function handler(req, res) {
  const { goals, selectedDemo } = req.body;
  const file = path.join(process.cwd(), "dashboard", "data", "activities.json");
  const stringified = readFileSync(file, "utf8");
  let data = JSON.parse(stringified)["data"];

  if (goals.includes("Sleep")) {
    data = data.filter(function (d) {
      let include = d.SleepGoal == "sleep";
      Object.keys(d).forEach((key) => {
        if (d[key] === null) {
          delete d[key];
        }
      });
      return include;
    });
  }
  if (goals.includes("Physical Health")) {
    data = data.filter(function (d) {
      let include = d.PhysGoal == "physical health";
      Object.keys(d).forEach((key) => {
        if (d[key] === null) {
          delete d[key];
        }
      });
      return include;
    });
  }
  if (goals.includes("Emotional Health")) {
    data = data.filter(function (d) {
      let include = d.EmoGoal == "emotional health";
      Object.keys(d).forEach((key) => {
        if (d[key] === null) {
          delete d[key];
        }
      });
      return include;
    });
  }
  if (goals.includes("Productivity")) {
    data = data.filter(function (d) {
      let include = d.ProductGoal == "productivity";
      Object.keys(d).forEach((key) => {
        if (d[key] === null) {
          delete d[key];
        }
      });
      return include;
    });
  }
  if (goals.includes("Social Wellness")) {
    data = data.filter(function (d) {
      let include = d.SocialGoal == "social wellness";
      Object.keys(d).forEach((key) => {
        if (d[key] === null) {
          delete d[key];
        }
      });
      return include;
    });
  }
  calc_rbo(data, selectedDemo);
  res.send(data);
}
