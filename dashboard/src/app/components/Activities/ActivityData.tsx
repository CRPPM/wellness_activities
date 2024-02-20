import { useState } from "react";
import Image from "next/image";
import { Stack, Card, Group, Badge, Button, Text } from "@mantine/core";
import ActivityCard from "./ActivityCard";

interface Props {
    goal: string | null;
    setGoal: Function;
}

export default function ActivityData({ goal, setGoal }: Props) {
    return (
        <div className="h-screen w-4/5 flex flex-col items-center overflow-y-auto pt-[9vh]">
            {goal != "" && (
                <Stack>
                    <h1 className="tracking-widest text-2xl w-full items-center uppercase">
                        Activities
                    </h1>
                    <ActivityCard
                        order={1}
                        activity={"making a schedule"}
                        percentage={46}
                        avgDuration={14.8}
                        avgFrequency={4}
                        altImage={"Writing a schedule in a notebook"}
                    />

                    <ActivityCard
                        order={2}
                        activity={"listening to nature sounds"}
                        percentage={41}
                        avgDuration={19.2}
                        avgFrequency={5}
                        altImage={"Listening to nature sounds"}
                    />

                    <ActivityCard
                        order={3}
                        activity={"showering"}
                        percentage={39}
                        avgDuration={60.1}
                        avgFrequency={3}
                        altImage={"Woman taking a shower"}
                    />

                    <ActivityCard
                        order={4}
                        activity={"exercising moderately"}
                        percentage={38}
                        avgDuration={24.0}
                        avgFrequency={6}
                        altImage={"Man running through a park"}
                    />

                    <ActivityCard
                        order={5}
                        activity={"going to bed early"}
                        percentage={35}
                        avgDuration={35}
                        avgFrequency={5}
                        altImage={"woman sleeping in a bed"}
                    />
                </Stack>
            )}
        </div>
    );
}
