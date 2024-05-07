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
    barColors: string[];
    setBarColors: Function;
    clearBarColors: boolean;
    setClearBarColors: Function;
    graphType: string;
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
    barColors,
    setBarColors,
    clearBarColors,
    setClearBarColors,
    graphType,
}: Props) {
    let iconSrc = "/images/" + iconImg;
    let goalSrc = "/images/" + goalImg;

    const [allGoalColor, setAllGoalColor] = useState("");
    // Tailwind cannot understand string interpolation or concatenation
    // https://tailwindcss.com/docs/content-configuration#dynamic-class-names
    const colorBackgrounds: { [key: string]: string } = {
        sleep: "bg-sleep",
        physical: "bg-physical",
        emotional: "bg-emotional",
        productivity: "bg-productivity",
        social: "bg-social",
    };

    const headerColors: { [key: string]: string } = {
        sleep: "!bg-sleepHeader",
        physical: "!bg-physicalHeader",
        emotional: "!bg-emotionalHeader",
        productivity: "!bg-productivityHeader",
        social: "!bg-socialHeader",
    };

    const hoverColorBackgrounds: { [key: string]: string } = {
        sleep: "hover:after:bg-sleep",
        physical: "hover:after:bg-physical",
        emotional: "hover:after:bg-emotional",
        productivity: "hover:after:bg-productivity",
        social: "hover:after:bg-social",
    };

    const colorUnderlines: { [key: string]: string } = {
        sleep: "after:bg-sleep",
        physical: "after:bg-physical",
        emotional: "after:bg-emotional",
        productivity: "after:bg-productivity",
        social: "after:bg-social",
    };

    useEffect(() => {
        if (clearBarColors) {
            setAllGoalColor("");
            setClearBarColors(false);
        }
    }, [clearBarColors]);

    useEffect(() => {
        if (curGoal == "All" && goal != "Select goals to display") {
            if (!barColors.includes(goal)) {
                setAllGoalColor("");
            }
        }
    }, [barColors]);

    return (
        <div>
            <div
                className={"flex " + centerText + allGoalColor}
                onClick={(e: any) => {
                    if (curGoal == "All" && goal != "Select goals to display") {
                        let clickedGoal = e.target.innerHTML;

                        if (clickedGoal.startsWith("<div")) {
                            // clicked on parent
                            clickedGoal = e.target.children[1].innerHTML;
                        } else if (clickedGoal == "") {
                            //clicked on icon
                            clickedGoal = e.target.alt.slice(
                                0,
                                e.target.alt.lastIndexOf(" "),
                            );
                            clickedGoal = clickedGoal.replace(
                                /(^\w{1})|(\s+\w{1})/g,
                                (letter: any) => letter.toUpperCase(),
                            );
                        }

                        if (allGoalColor == "") {
                            setAllGoalColor(
                                " " +
                                    headerColors[
                                        clickedGoal.split(" ")[0].toLowerCase()
                                    ],
                            );
                            if (graphType == "BarChart") {
                                setBarColors([...barColors, clickedGoal]);
                            } else {
                                setBarColors([clickedGoal]);
                            }
                        } else {
                            if (
                                barColors.length > 1 ||
                                graphType == "BarChart"
                            ) {
                                setAllGoalColor("");
                                setBarColors(
                                    barColors.filter((b) => b !== clickedGoal),
                                );
                            }
                        }
                    }
                }}
            >
                {iconImg != "" && (
                    <div
                        className="flex items-center"
                        style={{ width: "30px" }}
                    >
                        <Image
                            src={iconSrc}
                            width={50}
                            height={20}
                            objectFit="cover"
                            alt={alt}
                        />
                    </div>
                )}
                <h2
                    className={
                        "my-3 uppercase text-center " +
                        colorUnderlines[goalColor] +
                        " " +
                        (goal != "Select goals to display"
                            ? "ml-2 " + mousePointer
                            : "") +
                        hoverColorBackgrounds[goalColor] +
                        (curGoal == ""
                            ? " goal-animated text-lg "
                            : " text-xl ") +
                        (curGoal != "All" ? "text-gray-800" : "")
                    }
                    onClick={(e) => {
                        if (curGoal != "All") {
                            setOpened(false);
                            setGoal(goal);
                            setSideNavColor(colorBackgrounds[goalColor]);
                            setCenterText(
                                "justify-center mb-4 py-2 " +
                                    headerColors[goalColor],
                            );
                            setMousePointer("cursor-auto");
                        }
                    }}
                >
                    {goal}
                </h2>
            </div>
            {curGoal != "" && curGoal != "All" && (
                <div className="w-4/5 m-auto mt-1 mb-2">
                    <Image src={goalSrc} width={300} height={20} alt={goal} />
                </div>
            )}
        </div>
    );
}
