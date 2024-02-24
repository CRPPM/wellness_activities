import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Stack, Card, Group, Badge, Button, Text } from "@mantine/core";
import ActivityCard from "./ActivityCard";
import useData from "../Hooks/useData";

interface Props {
    goal: string | null;
    setGoal: Function;
}

export default function ActivityData({ goal, setGoal }: Props) {
    const [activityData, setActivityData] = useState([]);

    const loadMetric = async (goal) => {
        setActivityData(await useData(goal));
    };

    useEffect(() => {
        if (goal != "") {
            loadMetric(goal);
        }
    }, [goal]);

    return (
        <div
            className={
                "w-4/5 flex flex-col items-center pt-[9vh] " +
                (goal == "" ? "h-screen" : "h-fit")
            }
        >
            {goal != "" && (
                <Stack>
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
                            />
                        );
                    })}
                </Stack>
            )}
        </div>
    );
}
