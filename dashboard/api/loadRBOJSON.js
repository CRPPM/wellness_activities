"use server";
import { readFileSync } from "fs";
import path from "path";

function get_top_activities(data, demo_cols, goal, demo_value) {
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

  let act_cols = Object.keys(data[0]).filter(
    (key) =>
      key.endsWith("TimeW") ||
      key.endsWith("FreqW") ||
      demo_cols.includes(key) ||
      !key.startsWith(goalPrefix) ||
      key.endsWith("Goal"),
  );

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

  let rankings = [];
  Object.keys(sorted_count_dict)
    .slice(0, 10)
    .map(function (obj) {
      rankings.push({
        activity: obj,
        percentage: percent_dict[obj],
        demo: demo_value,
      });
    });

  return rankings;
}

function calc_rbo(l1, l2, p) {
  let [sl, ll] = [
    [l1.length, l1],
    [l2.length, l2],
  ].sort((a, b) => a[0] - b[0]);
  let [s, S] = sl;
  let [l, L] = ll;

  // Calculate the overlaps at ranks 1 through l
  // (the longer of the two lists)
  let ss = new Set();
  let ls = new Set();
  let overs = {};
  for (let i = 0; i < l; i++) {
    ls.add(L[i]);
    if (i < s) {
      ss.add(S[i]);
    }
    let X_d = [...ss].filter((item) => ls.has(item)).length;
    let d = i + 1;
    overs[d] = X_d;
  }

  // (1) \sum_{d=1}^l (X_d / d) * p^d
  let sum1 = 0;
  for (let i = 0; i < l; i++) {
    let d = i + 1;
    sum1 += (overs[d] / d) * Math.pow(p, d);
  }
  let X_s = overs[s];
  let X_l = overs[l];

  // (2) \sum_{d=s+1}^l [(X_s (d - s)) / (sd)] * p^d
  let sum2 = 0;
  for (let i = s; i < l; i++) {
    let d = i + 1;
    sum2 += ((X_s * (d - s)) / (s * d)) * Math.pow(p, d);
  }

  // (3) [(X_l - X_s) / l + X_s / s] * p^l
  let sum3 = ((X_l - X_s) / l + X_s / s) * Math.pow(p, l);

  // Equation 32.
  let rbo_ext = ((1 - p) / p) * (sum1 + sum2) + sum3;

  return rbo_ext;
}

// process data
function get_top_activities_wrapper(data, selectedDemo, goal) {
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
  let uniqueDemoValues = [];
  if (selectedDemo == "age") {
    data_A = data.filter((obj) => obj[demos_overall[selectedDemo]] == 1); // less than 18
    data_B = data.filter((obj) => obj[demos_overall[selectedDemo]] == 3); // greater than 50

    uniqueDemoValues = [1, 3];
  } else {
    let allDemoValues = data.map((d) => d[demos_overall[selectedDemo]]);
    let setDemoValues = new Set(allDemoValues.filter((item) => item !== null));
    uniqueDemoValues = [...setDemoValues];

    data_A = data.filter(
      (obj) => obj[demos_overall[selectedDemo]] == uniqueDemoValues[0],
    );
    data_B = data.filter(
      (obj) => obj[demos_overall[selectedDemo]] == uniqueDemoValues[1],
    );
    console.log("debug");
    console.log(uniqueDemoValues);
    console.log(data[0]);
    console.log(data_A.length);
    console.log(data_B.length);
  }
  let A_rankings = get_top_activities(
    data_A,
    Object.values(demos_overall),
    goal,
    uniqueDemoValues[0],
  );
  let B_rankings = get_top_activities(
    data_B,
    Object.values(demos_overall),
    goal,
    uniqueDemoValues[1],
  );

  return [A_rankings, B_rankings];
}

function filter_data(data, goal) {
  switch (goal) {
    case "Sleep":
      data = data.filter(function (d) {
        return d.SleepGoal == "sleep";
      });
      break;
    case "Physical Health":
      data = data.filter(function (d) {
        return d.PhysGoal == "physical health";
      });
      break;
    case "Emotional Health":
      data = data.filter(function (d) {
        return d.EmoGoal == "emotional health";
      });
      break;
    case "Productivity":
      data = data.filter(function (d) {
        return d.ProductGoal == "productivity";
      });
      break;
    case "Social Wellness":
      data = data.filter(function (d) {
        return d.SocialGoal == "social wellness";
      });
      break;
  }
  return data;
}
export default function handler(req, res) {
  const { goals, selectedDemos } = req.body;
  const file = path.join(process.cwd(), "dashboard", "data", "activities.json");
  const stringified = readFileSync(file, "utf8");
  let data = JSON.parse(stringified)["data"];

  let rbo_wrapper = [];
  selectedDemos.forEach((d) => {
    let rbo = {};
    rbo["demographic"] = d;

    let rbo_info = [];

    goals.forEach((g) => {
      let rbo_goal = {};
      rbo_goal["goal"] = g;
      let filtered_data = filter_data(data, g);

      let [A_rankings, B_rankings] = get_top_activities_wrapper(
        filtered_data,
        d,
        g,
      );

      rbo_goal["rbo"] = calc_rbo(
        A_rankings.map((r) => r.activity),
        B_rankings.map((r) => r.activity),
        0.98,
      );

      let reversed_A_rankings = [...A_rankings].reverse();
      rbo_goal["rankings"] = reversed_A_rankings.concat(B_rankings);
      rbo_info.push(rbo_goal);
    });
    rbo["rbo_info"] = rbo_info;

    rbo_wrapper.push(rbo);
  });

  res.send(rbo_wrapper);
}
