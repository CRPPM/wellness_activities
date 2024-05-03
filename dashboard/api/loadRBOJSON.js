"use server";
import { readFileSync } from "fs";
import path from "path";

function get_top_activities(data, demo_cols, goal) {
  // Count cols
  let goalPrefix = "";
  switch (goal) {
    case "Sleep":
      goalPrefix = "Sleep";
      break;
    case "Physical Health":
      goalPrefix = "Phys";
      break;
    case "Emotional Health":
      goalPrefix = "Emo";
      break;
    case "Productivity":
      goalPrefix = "Product";
      break;
    case "Social Wellness":
      goalPrefix = "Social";
      break;
  }
  console.log(Object.keys(data[0]));
  console.log(demo_cols);
  console.log(goalPrefix);
  let act_cols = Object.keys(data[0]).filter(
    (key) =>
      key.endsWith("TimeW") || key.endsWith("FreqW") || demo_cols.includes(key),
    // !key.startsWith(goalPrefix) ||
    // key.endsWith("Goal"),
  );
  console.log("Act Cols");
  console.log(act_cols);
  let act_data = structuredClone(data);
  act_data.map(function (obj) {
    return act_cols.forEach((e) => delete obj[e]);
  });

  let count_dict = {};
  let percent_dict = {};
  Object.keys(act_data[0]).forEach((key) => {
    count_dict[key] = 0;
    percent_dict[key] = 0;
  });

  act_data.reduce((previous, current, index, array) => {
    Object.keys(current).forEach((key) => {
      if (typeof previous !== "undefined") {
        if (previous[key] != null) {
          count_dict[key] += 1;
          percent_dict[key] += 1;
        }
      }
      if (current[key] != null) {
        count_dict[key] += 1;
        percent_dict[key] += 1;
      }
      if (index === array.length - 1) {
        percent_dict[key] /= array.length;
        percent_dict[key] *= 100;
      }
    });
  });

  const sorted_count_dict = Object.fromEntries(
    Object.entries(count_dict).sort(([, a], [, b]) => b - a),
  );

  console.log("Act Data");
  console.log(count_dict["EmoCall"]);
  return act_data;
}
// process data
function calc_rbo_wrapper(data, selectedDemo, goal) {
  let demos_overall = {
    age: "ageG",
    gender: "GenderB",
    race: "raceB",
    income: "incomeB",
    living: "locationB",
    sexual: "sexorB",
    mhsg: "MHSG",
    phsg: "PHSG",
    bfi: "BFIExtraHi",
  };

  let data_A, data_B;
  if (selectedDemo[0] == "age") {
    data_A = data.filter((obj) => obj[demos_overall[selectedDemo[0]]] == 1); // less than 18
    data_B = data.filter((obj) => obj[demos_overall[selectedDemo[0]]] == 3); // greater than 50
  } else {
    let allDemoValues = data.map((d) => d[demos_overall[selectedDemo[0]]]);
    let setDemoValues = new Set(allDemoValues);
    let uniqueDemoValues = [...setDemoValues];

    data_A = data.filter(
      (obj) => obj[demos_overall[selectedDemo[0]]] == uniqueDemoValues[0],
    );
    data_B = data.filter(
      (obj) => obj[demos_overall[selectedDemo[0]]] == uniqueDemoValues[1],
    );
  }
  // console.log(data_A);
  get_top_activities(data_A, Object.keys(demos_overall), goal);
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
  calc_rbo_wrapper(data, selectedDemo, goals[0]); //temporary, iterate through goals actually
  res.send(data);
}
