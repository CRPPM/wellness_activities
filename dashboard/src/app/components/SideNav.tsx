import { useState } from "react";
import Image from "next/image";
import SideNavGoal from "./SideNavGoal";

export default function SideNav() {
    const [goal, setGoal] = useState<string>();

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
                    <SideNavGoal
                        goal="Sleep"
                        goalImg="sleep_icon.png"
                        alt="sleep icon"
                    />
                    <SideNavGoal
                        goal="Physical Health"
                        goalImg="exercise_icon.png"
                        alt="physical health icon"
                    />
                    <SideNavGoal
                        goal="Emotional Health"
                        goalImg="emotions_icon.png"
                        alt="emotional health icon"
                    />
                    <SideNavGoal
                        goal="Productivity"
                        goalImg="improvement_icon.png"
                        alt="productivity icon"
                    />
                    <SideNavGoal
                        goal="Social Wellness"
                        goalImg="social_icon.png"
                        alt="social wellness icon"
                    />
                </div>
                <h1
                    className="mt-5 tracking-widest text-2xl w-full items-center uppercase text-center"
                    style={{ color: "#54b6a6" }}
                >
                    Filters
                </h1>
            </div>
        </div>
    );
}
