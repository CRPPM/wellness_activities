import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Stack, Card, Group, Badge, Button, Text } from "@mantine/core";
import ActivityCard from "./ActivityCard";
import useData from "../Hooks/useData";

interface Props {
    goal: string | null;
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
}: Props) {
    const [activityData, setActivityData] = useState([]);

    const loadMetric = async (goal) => {
        setActivityData(
            await useData(
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
            ),
        );
    };

    useEffect(() => {
        if (goal != "") {
            loadMetric(goal);
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

    return (
        <div
            className={
                "w-4/5 flex flex-col items-center pt-[9vh] " +
                (goal == "" ? "h-screen" : "h-fit")
            }
        >
            {goal != "" && (
                <Stack className="mb-8">
                    <h1 className="tracking-widest text-2xl w-full items-center uppercase">
                        Activities
                    </h1>

                    {activityData.map(function (ele, i) {
                        return (
                            <ActivityCard
                                order={i + 1}
                                activity={ele.index}
                                percentage={ele.Percentage.toFixed(2)}
                                avgDuration={Math.round(ele.Duration, 2)}
                                avgFrequency={ele.Frequency.toFixed(2)}
                                altImage={"writing a schedule in a notebook"}
                                goal={goal}
                                key={i}
                            />
                        );
                    })}
                </Stack>
            )}
        </div>
    );
}
