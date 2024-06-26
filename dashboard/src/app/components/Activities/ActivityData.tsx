import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
    Stack,
    Button,
    LoadingOverlay,
    Avatar,
    HoverCard,
    Text,
} from "@mantine/core";
import { MathJax } from "better-react-mathjax";
import ActivityCard from "./ActivityCard";
import useData from "../Hooks/useData";
import { QUESTIONS } from "../Hooks/activity_dict";
import BarChart from "../Graphs/BarChart";
import SankeyDiagram from "../Graphs/SankeyDiagram";
import * as d3 from "d3";

interface Props {
    goal: string;
    setGoal: Function;
    ageValue: number[];
    setAgeValue: Function;
    genderValue: number[];
    setGenderValue: Function;
    raceValue: number[];
    setRaceValue: Function;
    incomeValue: number[];
    setIncomeValue: Function;
    livingValue: number[];
    setLivingValue: Function;
    sexualValue: number[];
    setSexualValue: Function;
    mhsgValue: number[];
    setMhsgValue: Function;
    phsgValue: number[];
    setPhsgValue: Function;
    BFIExtraHiValue: number[];
    setBFIExtraHiValue: Function;
    setDisabledOptions: Function;
    barColors: string[];
    setBarColors: Function;
    graphType: string;
    setGraphType: Function;
    setFilters: Function;
}

export default function ActivityData({
    goal,
    setGoal,
    ageValue,
    setAgeValue,
    genderValue,
    setGenderValue,
    raceValue,
    setRaceValue,
    incomeValue,
    setIncomeValue,
    livingValue,
    setLivingValue,
    sexualValue,
    setSexualValue,
    mhsgValue,
    setMhsgValue,
    phsgValue,
    setPhsgValue,
    BFIExtraHiValue,
    setBFIExtraHiValue,
    setDisabledOptions,
    barColors,
    setBarColors,
    graphType,
    setGraphType,
    setFilters,
}: Props) {
    const [activityData, setActivityData] = useState([]);
    const [RBOData, setRBOData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [header, setHeader] = useState(() => {
        if (goal == "All") {
            return "How much do activities differ by demographic?";
        } else {
            return "Actvities";
        }
    });
    const [width, setWidth] = useState(1000);
    const [height, setHeight] = useState(1000);
    const svgContainer = useRef<any>();
    const [showBackArrow, setShowBackArrow] = useState(false);

    const titleColors: { [key: string]: string } = {
        Sleep: "#51b5a5",
        "Physical Health": "#dcc45a",
        "Emotional Health": "#3b8bff",
        Productivity: "#b78b66",
        "Social Wellness": "#ff611c",
        All: "#2b2927",
    };

    var colors = {
        Sleep: "#B4DFD8",
        "Physical Health": "#F9F5E3",
        "Emotional Health": "#E4EFFF",
        Productivity: "#E8DACE",
        "Social Wellness": "#FFCBB4",
    };

    const getSvgContainerSize = () => {
        if (svgContainer.current) {
            const newWidth = svgContainer.current.clientWidth - 100;
            setWidth(newWidth);

            const newHeight = svgContainer.current.clientHeight - 50;
            setHeight(newHeight);
        }
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
        barColors,
        setRBOData,
    );

    useEffect(() => {
        if (goal == "All") {
            setHeader("How much do activities differ by demographic?");

            // detect 'width' and 'height' on render
            getSvgContainerSize();
            // listen for resize changes, and detect dimensions again when they change
            window.addEventListener("resize", getSvgContainerSize);

            // cleanup event listener
            return () =>
                window.removeEventListener("resize", getSvgContainerSize);
        } else {
            setHeader("Actvities");
        }
    }, [goal]);

    useEffect(() => {
        if (goal == "All" && RBOData.length > 0) {
            if (graphType == "BarChart") {
                BarChart(
                    barColors,
                    setBarColors,
                    height,
                    width,
                    svgContainer,
                    setShowBackArrow,
                    setGraphType,
                    RBOData,
                    setRBOData,
                    setAgeValue,
                    setGenderValue,
                    setRaceValue,
                    setIncomeValue,
                    setLivingValue,
                    setSexualValue,
                    setMhsgValue,
                    setPhsgValue,
                    setBFIExtraHiValue,
                    setFilters,
                );
            } else {
                SankeyDiagram(
                    barColors,
                    setBarColors,
                    height,
                    width,
                    svgContainer,
                    colors[barColors[0] as keyof typeof colors],
                    RBOData,
                );
            }
        }
    }, [height, width, barColors, goal, RBOData]);

    function helperText() {
        if (goal == "All") {
            return (
                <div className="">
                    <div className="inline">
                        To compare activity preferences of different
                        demographics, we calculate the Ranked Biased Overlap
                        (RBO){" "}
                    </div>
                    <div className="inline-table align-middle mb-1f">
                        <HoverCard width={400} shadow="md">
                            <HoverCard.Target>
                                <Avatar
                                    // color="cyan"
                                    radius="xl"
                                    size="xs"
                                    color="#2B2927"
                                    variant="filled"
                                    className="self-center mr-1"
                                >
                                    i
                                </Avatar>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <MathJax className="text-sm">
                                    {`\\(RBO\\)`} [
                                    <a
                                        href="https://doi.org/10.1145/1852102.1852106"
                                        target="_blank"
                                    >
                                        1
                                    </a>
                                    ] is a similarity measure that falls between
                                    0-1, where an {`\\(RBO\\)`} of 0 means that
                                    the lists are disjoint and an {`\\(RBO\\)`}{" "}
                                    of 1 means the lists are identical.
                                </MathJax>
                                <MathJax
                                    style={{ marginTop: "1vh" }}
                                    className="text-sm"
                                >
                                    {`\\(RBO\\)`} is given by the following
                                    formula:
                                </MathJax>
                                <MathJax className="flex justify-center text-xs">
                                    {`\\[RBO(S, T, p) = (1-p)\\sum_{d = 1}^{\\infty}p^\\left(d-1\\right)\\cdot A_d\\]`}
                                </MathJax>
                                <MathJax className="text-sm">
                                    where {`\\(S\\)`} and {`\\(T\\)`} are two
                                    ranked lists being compared, {`\\(d\\)`}{" "}
                                    denotes the position in the list,{" "}
                                    {`\\(p\\)`} is a tunable parameter between
                                    0-1 that indicates how much the top-ranked
                                    items contribute to the metric, and{" "}
                                    {`\\(A_d\\)`} is the agreement at position{" "}
                                    {`\\(d\\)`} in the list (the ratio between
                                    the size of the intersection between the two
                                    lists up to position {`\\(d\\)`}). We set{" "}
                                    {`\\(p=0.98\\)`}, meaning that all the items
                                    in the list contributed almost evenly to the
                                    metric calculation.
                                </MathJax>
                            </HoverCard.Dropdown>
                        </HoverCard>{" "}
                    </div>
                    <div className="inline">
                        between the top ten activity lists of those belonging to
                        a demographic and those who do not.
                    </div>
                    <div className="mt-3">
                        Select goals and demographics to view a bar graph of the
                        RBO scores. Click on individual bars to view a Sankey
                        diagram that shows the activities chosen for the
                        selected goal separated by the selected demographic.
                    </div>
                </div>
            );
        } else {
            return (
                <div className="italic pt-2">
                    Here are the most popular activities for those who excelled
                    in the{" "}
                    <span
                        style={{ color: titleColors[goal] }}
                        className="font-semibold"
                    >
                        {goal.toUpperCase()}
                    </span>{" "}
                    goal. Use the filters on the left to see what works for
                    different people.
                </div>
            );
        }
    }
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
                                {header}
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

                        {helperText()}
                    </div>
                    <LoadingOverlay
                        visible={visible}
                        overlayProps={{ radius: "sm", blur: 3 }}
                    />
                    <div className="flex">
                        {showBackArrow && (
                            <Image
                                src={"/images/back-arrow.png"}
                                width={30}
                                height={2}
                                objectFit="cover"
                                alt={"Back Arrow"}
                                className="h-fit cursor-pointer"
                                onClick={() => {
                                    setShowBackArrow(false);
                                    d3.select(svgContainer.current)
                                        .selectAll("*")
                                        .remove();
                                    BarChart(
                                        barColors,
                                        setBarColors,
                                        height,
                                        width,
                                        svgContainer,
                                        setShowBackArrow,
                                        setGraphType,
                                        RBOData,
                                        setRBOData,
                                        setAgeValue,
                                        setGenderValue,
                                        setRaceValue,
                                        setIncomeValue,
                                        setLivingValue,
                                        setSexualValue,
                                        setMhsgValue,
                                        setPhsgValue,
                                        setBFIExtraHiValue,
                                        setFilters,
                                    );
                                    setGraphType("BarChart");
                                }}
                            />
                        )}
                        {goal == "All" && (
                            <div
                                id="activity-stack"
                                ref={svgContainer}
                                className="h-[70vh] min-w-[65vw]"
                            ></div>
                        )}
                    </div>

                    {goal != "All" &&
                        activityData.slice(0, 10).map(function (
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
