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
    setOpened: Function;
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
    setSideNavColor,
}: Props) {
    let iconSrc = "/images/" + iconImg;
    let goalSrc = "/images/" + goalImg;

    // Tailwind cannot understand string interpolation or concatenation
    // https://tailwindcss.com/docs/content-configuration#dynamic-class-names
    const colorBackgrounds = {
        sleep: "bg-sleep",
        physical: "bg-physical",
        emotional: "bg-emotional",
        productivity: "bg-productivity",
        social: "bg-social",
    };

    const colorUnderlines = {
        sleep: "decoration-sleep",
        physical: "decoration-physical",
        emotional: "decoration-emotional",
        productivity: "decoration-productivity",
        social: "decoration-social",
    };

    return (
        <div
            className={
                "flex flex-col underline decoration-4 underline-offset-4 " +
                colorUnderlines[goalColor]
            }
        >
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
                        setSideNavColor(colorBackgrounds[goalColor]);
                        setCenterText("justify-center mt-3");
                        setMousePointer("cursor-auto");
                    }}
                >
                    {goal}
                </h2>
            </div>
            {curGoal != "" && (
                <div className="w-4/5 m-auto mt-1 mb-2">
                    <Image src={goalSrc} width={300} height={20} />
                </div>
            )}
        </div>
    );
}
