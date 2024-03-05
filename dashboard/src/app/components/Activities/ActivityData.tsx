import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Stack, Button, LoadingOverlay } from "@mantine/core";
import ActivityCard from "./ActivityCard";
import useData from "../Hooks/useData";

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
    const { getData, getDisabledOptions } = useData(
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
        false,
    );

    useEffect(() => {
        if (goal != "") {
            setVisible(true);
            // let filteredData = getData();
            // console.log("disabledOptions");
            // console.log(filteredData);
            setActivityData(getData());
            setDisabledOptions(getDisabledOptions());
            setTimeout(() => {
                setVisible(false);
            }, 200);
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
        let data = getData();
        if (data.length != 0) {
            let headers = Object.keys(data[0]);
            headers.shift();
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

                let vals = Object.values(row);

                vals.shift();
                let actString = vals.join(",");

                actString = actString.replace(
                    "less than $49,999",
                    '"less than $49,999"',
                );
                actString = actString.replace(
                    "Greater than $50,000",
                    '"Greater than $50,000"',
                );
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
                "w-4/5 flex flex-col items-center pt-[9vh] " +
                (goal == "" ? "h-screen" : "h-fit")
            }
        >
            {goal != "" && (
                <Stack className="mb-8">
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
                    <LoadingOverlay
                        visible={visible}
                        overlayProps={{ radius: "sm", blur: 3 }}
                    />
                    {activityData.map(function (
                        ele: {
                            index: string;
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
                                    activity={ele.index}
                                    percentage={ele.Percentage.toFixed(2)}
                                    avgDuration={ele.Duration.toFixed(2)}
                                    avgFrequency={ele.Frequency.toFixed(2)}
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
