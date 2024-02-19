import { useState, useEffect } from "react";
import Image from "next/image";
import { Stack, Card, Group, Badge, Button, Text } from "@mantine/core";
import ActivityCard from "./ActivityCard";

interface Props {
    width: int;
    activity: string | null;
    percentage: int;
    avgDuration: int;
    avgFrequency: int;
    altImage: string | null;
}

export default function ActivityCard({
    order,
    activity,
    percentage,
    avgDuration,
    avgFrequency,
    altImage,
}: Props) {
    let imgSrc = "/images/" + activity.replaceAll(" ", "_") + ".png";
    const [width, setWidth] = useState<int>(100);
    const [textSize, setTextSize] = useState<string>("");
    const [textAccentSize, setTextAccentSize] = useState<string>("text-md");

    useEffect(() => {
        if (order == 1) {
            setWidth(150);
            setTextSize("md");
            setTextAccentSize("text-lg");
        } else {
            if (order == 2) {
                setWidth(100);
            } else {
                setWidth(75);
            }
            setTextSize("sm");
            setTextAccentSize("text-md");
        }
    });

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mt="xs" mb="xs">
                <div className="w-[10vw] flex justify-center">
                    <Image
                        src={imgSrc}
                        height={26}
                        width={width}
                        alt={altImage}
                    />
                </div>
                <Text fw={500} size={textSize} className="w-[50vw]">
                    <span className={"font-bold " + textAccentSize}>
                        {percentage}%
                    </span>{" "}
                    of people found that{" "}
                    <span className={"font-bold " + textAccentSize}>
                        {activity}
                    </span>{" "}
                    for{" "}
                    <span className={"font-bold " + textAccentSize}>
                        {avgDuration}
                    </span>{" "}
                    minutes on average{" "}
                    <span className={"font-bold " + textAccentSize}>
                        {avgFrequency} times a week
                    </span>{" "}
                    helped with their sleep.
                </Text>
            </Group>
        </Card>
    );
}
