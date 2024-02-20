import { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
    goal: string;
    iconImg: string;
    alt: string;
    setGoal: Function;
    curGoal: string;
    goalImg: string;
    centerText: string;
    setCenterText: Function;
    mousePointer: string;
    setMousePointer: Function;
    goalColor: string;
    open: Function;
    close: Function;
    setSideNavColor: Function;
}
export default function SideNavGoal({
    goal,
    iconImg,
    alt,
    setGoal,
    curGoal,
    goalImg,
    centerText,
    setCenterText,
    mousePointer,
    setMousePointer,
    goalColor,
    setOpened,
    opened,
    setSideNavColor,
}: Props) {
    let iconSrc = "/images/" + iconImg;
    let goalSrc = "/images/" + goalImg;

    useEffect(() => {
        // console.log(opened);
        if (!opened) {
            console.log(goal);
            setCenterText("justify-center");
            setMousePointer("cursor-auto");
            setSideNavColor("bg-" + goalColor);
        } else {
            // console.log("hey");
            setOpened(true);
        }
    }, [opened]);

    return (
        <div
            className={
                "flex flex-col underline decoration-4 underline-offset-4 decoration-" +
                goalColor
            }
        >
            {curGoal != "" && (
                <div className="w-4/5 m-auto mt-4 mb-2">
                    <Image src={goalSrc} width={300} height={20} />
                </div>
            )}
            <div className={"flex " + centerText}>
                <div className="flex items-center" style={{ width: "30px" }}>
                    <Image
                        src={iconSrc}
                        width={50}
                        height={20}
                        objectFit="cover"
                        alt={alt}
                    />
                </div>
                <h2
                    className={"ml-2 my-3 uppercase text-lg " + mousePointer}
                    onClick={(e) => {
                        setOpened(false);
                        setGoal(goal);
                        setSideNavColor("bg-" + goalColor);
                    }}
                >
                    {goal}
                </h2>
            </div>
        </div>
    );
}
