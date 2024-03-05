import { useState, useEffect } from "react";
import Image from "next/image";
import { Stack, Card, Group, Badge, Button, Text } from "@mantine/core";

interface Props {
    order: number;
    activity: string;
    percentage: string;
    avgDuration: string;
    avgFrequency: string;
    altImage: string;
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
    const [foundImgSrc, setFoundImgeSrc] = useState<Boolean>(false);
    const [width, setWidth] = useState<number>(100);
    const [textSize, setTextSize] = useState<string>("");
    const [textAccentSize, setTextAccentSize] = useState<string>("text-md");
    const [showImage, setShowImage] = useState<Boolean>(true);

    let imgSrc = "/images/" + activity.replaceAll(" ", "_") + ".png";
    let fallbackSrc = "/images/default.png";

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
        order > 10 ? setShowImage(false) : setShowImage(true);
    });

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            className={"!bg-zinc-100 !opacity-2"}
        >
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
                <div className="w-[50vw]">
                    <Text fw={500} size={textSize} className="max-sm:text-xs">
                        <span
                            className={
                                "font-bold max-sm:text-xs " + textAccentSize
                            }
                        >
                            {percentage}%
                        </span>{" "}
                        of people found that{" "}
                        <span
                            className={
                                "font-bold max-sm:text-xs" + textAccentSize
                            }
                        >
                            {activity} helped with their {goal.toLowerCase()}.
                        </span>{" "}
                    </Text>
                    <Text fw={500} size={textSize} className="max-sm:text-xs">
                        People engaged in this activity for{" "}
                        <span
                            className={
                                "font-bold max-sm:text-xs" + textAccentSize
                            }
                        >
                            {avgDuration}
                        </span>{" "}
                        minutes on average{" "}
                        <span
                            className={
                                "font-bold max-sm:text-xs" + textAccentSize
                            }
                        >
                            {avgFrequency} times a week.
                        </span>{" "}
                    </Text>
                </div>
            </Group>
        </Card>
    );
}
