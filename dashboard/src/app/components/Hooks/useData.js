"use server";
import path from "path";
import { readFileSync } from "fs";
import { QUESTIONS } from "./activity_dict";

export default async function useData(
    goal,
    ageValue,
    genderValue,
    raceValue,
    incomeValue,
    livingValue,
    sexualValue,
    mhsgValue,
    phsgValue,
    BFIExtraHiValue,
) {
    const file = path.join(process.cwd(), "data", "activities.json");
    const stringified = readFileSync(file, "utf8");
    const data = JSON.parse(stringified)["data"];
    return calculate_activity_stats(
        data,
        goal,
        ageValue,
        genderValue,
        raceValue,
        incomeValue,
        livingValue,
        sexualValue,
        mhsgValue,
        phsgValue,
        BFIExtraHiValue,
    );
}

const demo_cols = [
    "ageG",
    "GenderB",
    "raceB",
    "incomeB",
    "locationB",
    "sexorB",
    "MHSG",
    "PHSG",
    "BFIExtraHi",
];

function return_avg(data, goalPrefix, act_suffix) {
    let avg_cols = Object.keys(data[0]).filter(
        (key) => !key.endsWith(act_suffix) || !key.startsWith(goalPrefix),
    );

    let avg_data = structuredClone(data);
    avg_data.map(function (obj) {
        return avg_cols.forEach((e) => delete obj[e]);
    });

    let count_dict = {};
    Object.keys(avg_data[0]).forEach((key) => {
        count_dict[key] = 0;
    });

    let avg_dict = avg_data.reduce((previous, current, index, array) => {
        Object.keys(current).forEach((key) => {
            if (index == 1) {
                if (previous[key] != null) {
                    count_dict[key] += 1;
                }
            }
            current[key] += previous[key];

            if (current[key] != previous[key]) {
                count_dict[key] += 1;
            }

            if (index === array.length - 1) {
                current[key] /= count_dict[key];
            }
        });
        return current;
    });

    return avg_dict;
}

function filter_by_demographics(
    data,
    ageValue,
    genderValue,
    raceValue,
    incomeValue,
    livingValue,
    sexualValue,
    mhsgValue,
    phsgValue,
    BFIExtraHiValue,
) {
    [
        ageValue,
        genderValue,
        raceValue,
        incomeValue,
        livingValue,
        sexualValue,
        mhsgValue,
        phsgValue,
        BFIExtraHiValue,
    ].forEach((demo, i) => {
        data = data.filter(function (d) {
            if (demo.length == 0) return true;
            else {
                if (d[demo_cols[i]] != null)
                    return demo.includes(d[demo_cols[i]].toString());
            }
        });
    });

    return data;
}

function calculate_activity_stats(
    data,
    goal,
    ageValue,
    genderValue,
    raceValue,
    incomeValue,
    livingValue,
    sexualValue,
    mhsgValue,
    phsgValue,
    BFIExtraHiValue,
) {
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

    // Filter by demographics here
    data = filter_by_demographics(
        data,
        ageValue,
        genderValue,
        raceValue,
        incomeValue,
        livingValue,
        sexualValue,
        mhsgValue,
        phsgValue,
        BFIExtraHiValue,
    );

    // Count cols
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

    let duration_dict = return_avg(data, goalPrefix, "TimeW");
    let freq_dict = return_avg(data, goalPrefix, "FreqW");

    const sorted_count_dict = Object.fromEntries(
        Object.entries(count_dict).sort(([, a], [, b]) => b - a),
    );

    let display_data = [];
    Object.keys(sorted_count_dict).map(function (obj) {
        display_data.push({
            index: QUESTIONS[obj],
            Count: sorted_count_dict[obj],
            Percentage: percent_dict[obj],
            Duration: duration_dict[obj + "TimeW"],
            Frequency: freq_dict[obj + "FreqW"],
        });
    });

    return display_data;
}
