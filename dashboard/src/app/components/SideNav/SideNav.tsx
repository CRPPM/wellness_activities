import { useState } from "react";
import Image from "next/image";
import SideNavGoal from "./SideNavGoal";
import { Checkbox, Group, RangeSlider, Button } from "@mantine/core";

interface Props {
    goal: string | null;
    setGoal: Function;
}

export default function SideNav({ goal, setGoal }: Props) {
    return (
        <div className="h-screen w-1/5 flex flex-col items-center bg-sleep overflow-y-auto">
            <div className="w-full flex flex-col items-center">
                <h1
                    className="mt-5 tracking-widest text-2xl w-full items-center uppercase text-center"
                    style={{ color: "#54b6a6" }}
                >
                    Goal
                </h1>
                <div className="w-full">
                    {(goal == "" || goal == "Sleep") && (
                        <SideNavGoal
                            goal="Sleep"
                            iconImg="sleep_icon.png"
                            alt="sleep icon"
                            setGoal={setGoal}
                            curGoal={goal}
                            goalImg="sleep.png"
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
                        />
                    )}
                    {goal != "" && (
                        <div className="text-center cursor-pointer italic text-xs mb-3">
                            Select another goal{" "}
                        </div>
                    )}
                </div>
                {goal != "" && (
                    <div className="w-full">
                        <h1
                            className="mt-2 tracking-widest text-2xl w-full items-center uppercase text-center"
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

{
    /*<div>"Age Range:"
                        "Gender M/F/Other"
                        "Sexuality:"
                        "Race"
                        "Living"
                        "Safety enough"
                        "Wearable"
                        "Marital Status"
                        "Health Conditions n=> 50"
                        "Chronic pain"
                        </div>*/
}
