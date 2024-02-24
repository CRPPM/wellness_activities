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

    const titleBackgrounds = {
        sleep: "bg-sleepText",
        physical: "bg-physicalText",
        emotional: "bg-emotionalText",
        productivity: "bg-productivityText",
        social: "bg-socialText",
    };

    const hoverColorBackgrounds = {
        sleep: "hover:after:bg-sleep",
        physical: "hover:after:bg-physical",
        emotional: "hover:after:bg-emotional",
        productivity: "hover:after:bg-productivity",
        social: "hover:after:bg-social",
    };

    const colorUnderlines = {
        sleep: "after:bg-sleep",
        physical: "after:bg-physical",
        emotional: "after:bg-emotional",
        productivity: "after:bg-productivity",
        social: "after:bg-social",
    };

    return (
        <div>
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
                    className={
                        "ml-2 my-3 text-gray-800 uppercase " +
                        mousePointer +
                        " " +
                        colorUnderlines[goalColor] +
                        " " +
                        hoverColorBackgrounds[goalColor] +
                        (curGoal == "" ? " goal-animated text-lg" : " text-xl")
                    }
                    onClick={(e) => {
                        setOpened(false);
                        setGoal(goal);
                        setSideNavColor(colorBackgrounds[goalColor]);
                        setCenterText(
                            "justify-center mb-4 pt-2 " +
                                titleBackgrounds[goalColor],
                        );
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
