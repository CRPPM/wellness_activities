"use client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useState } from "react";
import SideNav from "./components/SideNav/SideNav";
import ActivityData from "./components/Activities/ActivityData";

export default function Home() {
  const [goal, setGoal] = useState<string>("");

  return (
    <MantineProvider>
      <div className="flex">
        <SideNav goal={goal} setGoal={setGoal} />
        <ActivityData goal={goal} setGoal={setGoal} />
      </div>
    </MantineProvider>
  );
}
