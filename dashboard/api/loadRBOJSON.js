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
  Object.keys(act_data[0]).forEach((key) => {
    count_dict[key] = 0;
  });
  act_data.reduce((previous, current, index, array) => {
    Object.keys(current).forEach((key) => {
      if (typeof previous !== "undefined") {
        if (previous[key] != null) {
          count_dict[key] += 1;
        }
      }
      if (current[key] != null) {
        count_dict[key] += 1;
      }
    });
  });

  const sorted_count_dict = Object.fromEntries(
    Object.entries(count_dict).sort(([, a], [, b]) => b - a),
  );

  return Object.keys(sorted_count_dict).slice(0, 10);
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
  if (selectedDemo == "age") {
    data_A = data.filter((obj) => obj[demos_overall[selectedDemo[0]]] == 1); // less than 18
    data_B = data.filter((obj) => obj[demos_overall[selectedDemo[0]]] == 3); // greater than 50
  } else {
    let allDemoValues = data.map((d) => d[demos_overall[selectedDemo]]);
    let setDemoValues = new Set(allDemoValues);
    let uniqueDemoValues = [...setDemoValues];

    data_A = data.filter(
      (obj) => obj[demos_overall[selectedDemo]] == uniqueDemoValues[0],
    );
    data_B = data.filter(
      (obj) => obj[demos_overall[selectedDemo]] == uniqueDemoValues[1],
    );
  }
  console.log(selectedDemo);
  console.log(uniqueDemoValues);
  let A_list = get_top_activities(data_A, Object.values(demos_overall), goal);
  let B_list = get_top_activities(data_B, Object.values(demos_overall), goal);
  console.log("A");
  console.log(A_list);
  console.log("B");
  console.log(B_list);

  return calc_rbo(A_list, B_list, 0.98);
}

export default function handler(req, res) {
  const { goals, selectedDemos } = req.body;
  const file = path.join(process.cwd(), "dashboard", "data", "activities.json");
  const stringified = readFileSync(file, "utf8");
  let data = JSON.parse(stringified)["data"];

  if (goals.includes("Sleep")) {
    data = data.filter(function (d) {
      return d.SleepGoal == "sleep";
    });
  }
  if (goals.includes("Physical Health")) {
    data = data.filter(function (d) {
      return d.PhysGoal == "physical health";
    });
  }
  if (goals.includes("Emotional Health")) {
    data = data.filter(function (d) {
      return d.EmoGoal == "emotional health";
    });
  }
  if (goals.includes("Productivity")) {
    data = data.filter(function (d) {
      return d.ProductGoal == "productivity";
    });
  }
  if (goals.includes("Social Wellness")) {
    data = data.filter(function (d) {
      return d.SocialGoal == "social wellness";
    });
  }
  let rbos = [];
  selectedDemos.forEach((d) => {
    let rbo = {};
    rbo["demographic"] = d;
    goals.forEach((g) => {
      rbo[g] = calc_rbo_wrapper(data, d, g);
    });
    rbos.push(rbo);
  });

  console.log(rbos);
  res.send(rbos);
}
