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
    goal: string;
}

export default function ActivityCard({
    order,
    activity,
    percentage,
    avgDuration,
    avgFrequency,
    altImage,
    goal,
}: Props) {
    const [foundImgSrc, setFoundImgeSrc] = useState<string>(false);
    let imgSrc = "/images/" + activity.replaceAll(" ", "_") + ".png";
    let fallbackSrc = "/images/default.png";
    const [width, setWidth] = useState<int>(100);
    const [textSize, setTextSize] = useState<string>("");
    const [textAccentSize, setTextAccentSize] = useState<string>("text-md");
    const [showImage, setShowImage] = useState<Boolean>(true);

    if (goal == "Physical Health") {
        if (
            activity.includes("exercising moderately") ||
            activity.includes("time in nature")
        ) {
            imgSrc = "/images/" + activity.replaceAll(" ", "_") + "_phys.png";
        }
    }

    if (goal == "Emotional Health") {
        if (activity.includes("exercising moderately")) {
            imgSrc = "/images/" + activity.replaceAll(" ", "_") + "_emo.png";
        }
    }

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
        order > 5 ? setShowImage(false) : setShowImage(true);
    });

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group
                justify="space-between"
                mt="xs"
                mb="xs"
                className={order > 5 ? "m-auto !mt-0 !mb-0" : ""}
            >
                {showImage && (
                    <div className="w-[10vw] flex justify-center">
                        <Image
                            src={foundImgSrc ? fallbackSrc : imgSrc}
                            height={26}
                            width={width}
                            alt={altImage}
                            onErrorCapture={() => {
                                setFoundImgeSrc(true);
                            }}
                        />
                    </div>
                )}
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
