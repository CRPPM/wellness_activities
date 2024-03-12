import path from "path";
import { QUESTIONS } from "./activity_dict";
import { useRef, useEffect } from "react";

const useData = (
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
    setActivityData,
    setDisabledOptions,
    setVisible,
) => {
    const rawData = useRef([]);
    const loadMetric = async (goal) => {
        return new Promise((resolve, reject) => {
            let path = "/api/loadActivityJSON.js";
            fetch(path, {
                method: "POST",
                body: JSON.stringify({
                    goal: goal,
                    ageValue: ageValue,
                }),
                headers: { "Content-Type": "application/json" },
            }).then((res) => {
                if (res.ok) {
                    res.json().then((data) => {
                        try {
                            console.log(data);
                            let prepped_data = prepare_data(
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
                                rawData,
                            );
                            console.log(prepped_data[0]);
                            setActivityData(prepped_data[0]);
                            setDisabledOptions(prepped_data[1]);

                            resolve(true);
                            // ... continue processing
                        } catch (err) {
                            console.log(err);
                            resolve(false);
                        }
                    });
                }
            });
        });
    };

    useEffect(() => {
        if (goal != "") {
            setVisible(true);
            Promise.all([loadMetric(goal)]).then(() => {
                console.log("loaded JSON");
                setVisible(false);
            });
        }
    }, [
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
    ]);

    function getRawData() {
        return rawData.current;
    }

    return { getRawData };
};

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

const demoValues = [
    {
        value: "Age",
        options: ["1", "2", "3"],
    },
    {
        value: "Gender",
        options: ["1", "2"],
    },
    {
        value: "Race",
        options: ["White", "Minority"],
    },
    {
        value: "Income",
        options: ["less than $49,999", "Greater than $50,000"],
    },
    {
        value: "Location",
        options: ["Rural", "Suburban/City"],
    },
    {
        value: "Sexual Orientation",
        options: ["Heterosexual", "LGBTQAI+"],
    },
    {
        value: "MHSG",
        options: ["0", "1"],
    },
    {
        value: "PHSG",
        options: ["0", "1"],
    },
    {
        value: "BFIExtraHi",
        options: ["low", "high"],
    },
];

function return_avg(data, goalPrefix, act_suffix) {
    console.log(act_suffix);
    let avg_cols = Object.keys(data[0]).filter(
        (key) => !key.endsWith(act_suffix) || !key.startsWith(goalPrefix),
    );

    let avg_data = structuredClone(data);
    avg_data.map(function (obj) {
        return avg_cols.forEach((e) => delete obj[e]);
    });
    console.log("avg_data");
    console.log(avg_data);
    let count_dict = {};
    Object.keys(avg_data[0]).forEach((key) => {
        count_dict[key] = 0;
    });
    console.log("count_dict");
    console.log(count_dict);
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
    console.log("avg_dict");
    console.log(avg_dict);
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
    let demos = [
        ageValue,
        genderValue,
        raceValue,
        incomeValue,
        livingValue,
        sexualValue,
        mhsgValue,
        phsgValue,
        BFIExtraHiValue,
    ];
    demos.forEach((demo, i) => {
        data = data.filter(function (d) {
            if (demo.length == 0) return true;
            else {
                if (d[demo_cols[i]] != null)
                    return demo.includes(d[demo_cols[i]].toString());
            }
        });
    });

    let disabled_options = [];
    demoValues.forEach((demo, i) => {
        demo.options.forEach((opt) => {
            if (demos[i].includes(opt)) {
                disabled_options.push(demo.value + "=" + opt);
                return;
            }
            let test_data = structuredClone(data);
            let remaining_data = test_data.filter(function (d) {
                if (d[demo_cols[i]] != null)
                    return [...demos[i], opt].includes(
                        d[demo_cols[i]].toString(),
                    );
            }).length;

            if (remaining_data < 20)
                disabled_options.push(demo.value + "=" + opt);
        });
    });
    return [data, disabled_options];
}

function prepare_data(
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
    rawData,
) {
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

    // put nulls back in (need this for csv download)
    data.forEach((d) => {
        Object.keys(QUESTIONS).forEach((q) => {
            if (!(q in d)) {
                d[q] = null;
            }
            let timeW = q + "TimeW";
            if (!(timeW in d)) {
                d[timeW] = null;
            }
            let freqW = q + "FreqW";
            if (!(freqW in d)) {
                d[freqW] = null;
            }
        });
    });
    console.log("fixed data");
    console.log(data);

    // Filter by demographics here
    let disabled_options;
    [data, disabled_options] = filter_by_demographics(
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

    // Save raw data
    let raw_cols = Object.keys(data[0]).filter(
        (key) =>
            (!key.startsWith(goalPrefix) || key.endsWith("Goal")) &&
            !demo_cols.includes(key),
    );
    let raw_data = structuredClone(data);
    raw_data.map(function (obj) {
        return raw_cols.forEach((e) => delete obj[e]);
    });

    rawData.current = raw_data;

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

    return [display_data, disabled_options];
}

export default useData;
