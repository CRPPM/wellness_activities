import { useState, useEffect } from "react";
import Image from "next/image";
import SideNavGoal from "./SideNavGoal";
import { Checkbox, Group, RangeSlider, Button } from "@mantine/core";

interface Props {
    goal: string;
    setGoal: Function;
    setBgColor: Function;
}

export default function SideNav({ goal, setGoal, setBgColor }: Props) {
    const [centerText, setCenterText] = useState("mt-3 ml-5");
    const [mousePointer, setMousePointer] = useState("cursor-pointer");
    const [sideNavColor, setSideNavColor] = useState("");
    const [opened, setOpened] = useState(true);
    const [outerStyle, setOuterStyle] = useState(
        "flex flex-col items-center bg-white p-4 h-fit w-[375px] fixed top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 rounded-md shadow-custom",
    );

    useEffect(() => {
        if (opened) {
            setOuterStyle(
                "flex flex-col items-center bg-white p-4 h-fit w-[375px] fixed top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 rounded-md shadow-custom",
            );
            setBgColor("bg-zinc-100");
        } else {
            setOuterStyle(
                "h-screen w-1/5 flex flex-col items-center overflow-y-auto " +
                    sideNavColor,
            );
            setBgColor("bg-white");
        }
    }, [opened]);

    return (
        <div className={outerStyle}>
            <div className="w-full flex flex-col items-center">
                {goal == "" && (
                    <h1
                        className="mt-5 tracking-widest text-2xl w-full items-center uppercase text-center"
                        style={{ color: "#54b6a6" }}
                    >
                        Select a Goal
                    </h1>
                )}
                <div className="w-full">
                    {(goal == "" || goal == "Sleep") && (
                        <SideNavGoal
                            goal="Sleep"
                            iconImg="sleep_icon.png"
                            alt="sleep icon"
                            setGoal={setGoal}
                            curGoal={goal}
                            goalImg="sleep.png"
                            centerText={centerText}
                            setCenterText={setCenterText}
                            mousePointer={mousePointer}
                            setMousePointer={setMousePointer}
                            goalColor="sleep"
                            setOpened={setOpened}
                            setSideNavColor={setSideNavColor}
                        />
                    )}
                    {(goal == "" || goal == "Physical Health") && (
                        <SideNavGoal
                            goal="Physical Health"
                            iconImg="exercise_icon.png"
                            alt="physical health icon"
                            setGoal={setGoal}
                            curGoal={goal}
                            goalImg="sleep.png"
                            centerText={centerText}
                            setCenterText={setCenterText}
                            mousePointer={mousePointer}
                            setMousePointer={setMousePointer}
                            goalColor="physical"
                            setOpened={setOpened}
                            setSideNavColor={setSideNavColor}
                        />
                    )}
                    {(goal == "" || goal == "Emotional Health") && (
                        <SideNavGoal
                            goal="Emotional Health"
                            iconImg="emotions_icon.png"
                            alt="emotional health icon"
                            setGoal={setGoal}
                            curGoal={goal}
                            goalImg="sleep.png"
                            centerText={centerText}
                            setCenterText={setCenterText}
                            mousePointer={mousePointer}
                            setMousePointer={setMousePointer}
                            goalColor="emotional"
                            setOpened={setOpened}
                            setSideNavColor={setSideNavColor}
                        />
                    )}
                    {(goal == "" || goal == "Productivity") && (
                        <SideNavGoal
                            goal="Productivity"
                            iconImg="improvement_icon.png"
                            alt="productivity icon"
                            setGoal={setGoal}
                            curGoal={goal}
                            goalImg="sleep.png"
                            centerText={centerText}
                            setCenterText={setCenterText}
                            mousePointer={mousePointer}
                            setMousePointer={setMousePointer}
                            goalColor="productivity"
                            setOpened={setOpened}
                            setSideNavColor={setSideNavColor}
                        />
                    )}
                    {(goal == "" || goal == "Social Wellness") && (
                        <SideNavGoal
                            goal="Social Wellness"
                            iconImg="social_icon.png"
                            alt="social wellness icon"
                            setGoal={setGoal}
                            curGoal={goal}
                            goalImg="sleep.png"
                            centerText={centerText}
                            setCenterText={setCenterText}
                            mousePointer={mousePointer}
                            setMousePointer={setMousePointer}
                            goalColor="social"
                            setOpened={setOpened}
                            setSideNavColor={setSideNavColor}
                        />
                    )}
                    {goal != "" && (
                        <div
                            className="text-center cursor-pointer italic text-xs mb-3 mt-2 underline decoration-2 underline-offset-4 decoration-gray-600"
                            onClick={() => {
                                setCenterText("mt-3 ml-5");
                                setGoal("");
                                setMousePointer("cursor-pointer");
                                setOpened(true);
                            }}
                        >
                            Select another goal{" "}
                        </div>
                    )}
                </div>
                {goal != "" && (
                    <div className="w-full">
                        <h1
                            className="mt-5 tracking-widest text-2xl w-full items-center uppercase text-center"
                            style={{ color: "#54b6a6" }}
                        >
                            Filters
                        </h1>
                        <div>
                            {/* Age Range */}
                            <div className=" w-4/5 flex my-3 ml-5 flex-col">
                                <div className="mb-3 font-medium">
                                    Age Range
                                </div>
                                <RangeSlider
                                    minRange={1}
                                    min={16}
                                    max={24}
                                    step={1}
                                    defaultValue={[18, 22]}
                                    marks={[
                                        { value: 16, label: "16" },
                                        { value: 18, label: "18" },
                                        { value: 20, label: "20" },
                                        { value: 22, label: "22" },
                                        { value: 24, label: "24" },
                                    ]}
                                />
                            </div>

                            {/* Gender */}
                            <div className="flex my-8 ml-5 flex-col">
                                <div className="mb-3 font-medium">Gender</div>
                                <Group className="mx-3">
                                    <Checkbox
                                        defaultunchecked="true"
                                        onChange={() => {}}
                                        label="Male"
                                        size="xs"
                                    />
                                    <Checkbox
                                        defaultunchecked="true"
                                        onChange={() => {}}
                                        label="Female"
                                        size="xs"
                                    />
                                    <Checkbox
                                        defaultunchecked="true"
                                        onChange={() => {}}
                                        label="Other"
                                        size="xs"
                                    />
                                </Group>
                            </div>

                            {/* Race/Ethnicity */}
                            <div className="flex my-8 ml-5 flex-col">
                                <div className="mb-3 font-medium">
                                    Race/Ethnicity
                                </div>
                                <Group className="mx-3">
                                    <Checkbox
                                        defaultunchecked="true"
                                        onChange={() => {}}
                                        label="American Indian or Alaskan Native"
                                        size="xs"
                                    />
                                    <Checkbox
                                        defaultunchecked="true"
                                        onChange={() => {}}
                                        label="Asian / Pacific Islander"
                                        size="xs"
                                    />
                                    <Checkbox
                                        defaultunchecked="true"
                                        onChange={() => {}}
                                        label="Black or African American"
                                        size="xs"
                                    />
                                    <Checkbox
                                        defaultunchecked="true"
                                        onChange={() => {}}
                                        label="Hispanic"
                                        size="xs"
                                    />
                                    <Checkbox
                                        defaultunchecked="true"
                                        onChange={() => {}}
                                        label="White / Caucasian"
                                        size="xs"
                                    />
                                </Group>
                            </div>

                            {/* Living Area */}
                            <div className="flex my-8 ml-5 flex-col">
                                <div className="mb-3 font-medium">Living</div>
                                <Group className="mx-3">
                                    <Checkbox
                                        defaultunchecked="true"
                                        onChange={() => {}}
                                        label="Urban"
                                        size="xs"
                                    />
                                    <Checkbox
                                        defaultunchecked="true"
                                        onChange={() => {}}
                                        label="Rural"
                                        size="xs"
                                    />
                                </Group>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
