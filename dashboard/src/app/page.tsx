"use client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useState } from "react";
import SideNav from "./components/SideNav/SideNav";
import ActivityData from "./components/Activities/ActivityData";

export default function Home() {
  const [goal, setGoal] = useState<string>("");
  const [bgColor, setBgColor] = useState<string>("bg-zinc-100 opacity-2");

  return (
    <MantineProvider>
      <div className={"flex " + bgColor}>
        <SideNav goal={goal} setGoal={setGoal} setBgColor={setBgColor} />
        <ActivityData goal={goal} setGoal={setGoal} />
      </div>
    </MantineProvider>
  );
}
