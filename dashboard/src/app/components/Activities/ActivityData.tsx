import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Stack, Button, LoadingOverlay } from "@mantine/core";
import ActivityCard from "./ActivityCard";
import useData from "../Hooks/useData";
import { QUESTIONS } from "../Hooks/activity_dict";

interface Props {
    goal: string;
    setGoal: Function;
    ageValue: number[];
    genderValue: number[];
    raceValue: number[];
    incomeValue: number[];
    livingValue: number[];
    sexualValue: number[];
    mhsgValue: number[];
    phsgValue: number[];
    BFIExtraHiValue: number[];
    setDisabledOptions: Function;
}

export default function ActivityData({
    goal,
    setGoal,
    ageValue,
    genderValue,
    raceValue,
    incomeValue,
    livingValue,
    sexualValue,
    mhsgValue,
    phsgValue,
    BFIExtraHiValue,
    setDisabledOptions,
}: Props) {
    const [activityData, setActivityData] = useState([]);
    const [visible, setVisible] = useState(false);

    const titleColors: { [key: string]: string } = {
        Sleep: "#51b5a5",
        "Physical Health": "#dcc45a",
        "Emotional Health": "#3b8bff",
        Productivity: "#b78b66",
        "Social Wellness": "#ff611c",
    };
    const { getRawData } = useData(
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
    );

    const downloadFile = ({
        data,
        fileName,
        fileType,
    }: {
        data: BlobPart;
        fileName: string;
        fileType: string;
    }) => {
        const blob = new Blob([data], { type: fileType });
        const a = document.createElement("a");
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        const clickEvt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        a.dispatchEvent(clickEvt);
        a.remove();
    };

    async function downloadData() {
        let data = getRawData();
        let demos = [
            "GenderB",
            "sexorB",
            "raceB",
            "incomeB",
            "locationB",
            "MHSG",
            "PHSG",
            "BFIExtraHi",
            "ageG",
        ];
        if (data.length != 0) {
            let headers = Object.keys(data[0]);
            headers.shift();
            headers = headers.filter(function (item) {
                return !demos.includes(item);
            });
            headers.sort();
            headers.push.apply(headers, demos);

            headers = [headers.join(",")];

            // Convert users data to a csv
            let rawCSV = data.reduce((acc: string[], row: any) => {
                row.GenderB = ["man", "woman"][Number(row.GenderB) - 1];
                row.MHSG = [
                    "no mental health diagnoses",
                    "mental health diagnoses",
                ][Number(row.MHSG)];
                row.PHSG = [
                    "no physical health diagnoses",
                    "physical health diagnoses",
                ][Number(row.PHSG)];
                row.ageG = ["18-29", "30-49", "50+"][Number(row.ageG) - 1];
                let vals: string[] = [];

                headers[0].split(",").forEach(function (h) {
                    if (
                        row[h] !== null &&
                        !h.includes("TimeW") &&
                        !h.includes("FreqW") &&
                        !demos.includes(h)
                    ) {
                        let activityVal: string =
                            QUESTIONS[
                                h as keyof typeof QUESTIONS
                            ][0].toString();
                        vals.push(activityVal);
                    } else {
                        vals.push(row[h]);
                    }
                });

                vals.forEach((v: any, i: number, arr: string[]) => {
                    if (v != null && typeof v === "string" && v.includes(",")) {
                        arr[i] = '"' + v + '"';
                    }
                });

                let actString = vals.join(",");

                acc.push(actString);

                return acc;
            }, []);

            downloadFile({
                data: [...headers, ...rawCSV].join("\n"),
                fileName: "activityData.csv",
                fileType: "text/csv",
            });
        }
    }

    return (
        <div
            className={
                "flex flex-col items-center pt-[9vh] " +
                (goal == "" ? "h-screen" : "h-fit w-4/5 ")
            }
        >
            {goal != "" && (
                <Stack className="mb-8 min-w-[60vw] max-w-[70vw]">
                    <div>
                        <div className="flex">
                            <h1 className="tracking-widest text-2xl w-full items-center uppercase">
                                Activities
                            </h1>
                            <Button
                                color={titleColors[goal]}
                                style={{ width: "170px" }}
                                radius="xs"
                                onClick={downloadData}
                            >
                                Download CSV
                            </Button>
                        </div>

                        <div className="italic pt-2">
                            Here are the most popular activities for those who
                            excelled in the{" "}
                            <span
                                style={{ color: titleColors[goal] }}
                                className="font-semibold"
                            >
                                {goal.toUpperCase()}
                            </span>{" "}
                            goal. Use the filters on the left to see what works
                            for different people.
                        </div>
                    </div>
                    <LoadingOverlay
                        visible={visible}
                        overlayProps={{ radius: "sm", blur: 3 }}
                    />
                    {activityData.slice(0, 10).map(function (
                        ele: {
                            index: [string, number];
                            Count: number;
                            Percentage: number;
                            Duration: number;
                            Frequency: number;
                        },
                        i: number,
                    ) {
                        if (ele.Percentage > 0) {
                            return (
                                <ActivityCard
                                    order={i + 1}
                                    activity={ele.index[0]}
                                    include_time={ele.index[1]}
                                    percentage={ele.Percentage.toFixed(0)}
                                    avgDuration={ele.Duration.toFixed(0)}
                                    avgFrequency={ele.Frequency.toFixed(0)}
                                    altImage={
                                        "writing a schedule in a notebook"
                                    }
                                    goal={goal}
                                    key={i}
                                />
                            );
                        }
                    })}
                </Stack>
            )}
        </div>
    );
}
