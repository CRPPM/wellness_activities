"use client";
import { MantineProvider } from "@mantine/core";
import { MathJaxContext } from "better-react-mathjax";
import "@mantine/core/styles.css";
import { useState } from "react";
import SideNav from "./components/SideNav/SideNav";
import ActivityData from "./components/Activities/ActivityData";

export default function Home() {
  const [goal, setGoal] = useState<string>("");
  const [bgColor, setBgColor] = useState<string>("bg-zinc-100 opacity-2");
  const [ageValue, setAgeValue] = useState([]);
  const [genderValue, setGenderValue] = useState([]);
  const [raceValue, setRaceValue] = useState([]);
  const [incomeValue, setIncomeValue] = useState([]);
  const [livingValue, setLivingValue] = useState([]);
  const [sexualValue, setSexualValue] = useState([]);
  const [mhsgValue, setMhsgValue] = useState([]);
  const [phsgValue, setPhsgValue] = useState([]);
  const [BFIExtraHiValue, setBFIExtraHiValue] = useState([]);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const [barColors, setBarColors] = useState<string[]>([]);
  const [graphType, setGraphType] = useState<string>("BarChart");

  const config = {
    loader: { load: ["[tex]/html"] },
    tex: {
      packages: { "[+]": ["html"] },
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"],
      ],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"],
      ],
    },
  };

  return (
    <MantineProvider>
      <MathJaxContext config={config}>
        <div className={"flex " + bgColor}>
          <SideNav
            goal={goal}
            setGoal={setGoal}
            setBgColor={setBgColor}
            ageValue={ageValue}
            setAgeValue={setAgeValue}
            genderValue={genderValue}
            setGenderValue={setGenderValue}
            raceValue={raceValue}
            setRaceValue={setRaceValue}
            incomeValue={incomeValue}
            setIncomeValue={setIncomeValue}
            livingValue={livingValue}
            setLivingValue={setLivingValue}
            sexualValue={sexualValue}
            setSexualValue={setSexualValue}
            mhsgValue={mhsgValue}
            setMhsgValue={setMhsgValue}
            phsgValue={phsgValue}
            setPhsgValue={setPhsgValue}
            BFIExtraHiValue={BFIExtraHiValue}
            setBFIExtraHiValue={setBFIExtraHiValue}
            disabledOptions={disabledOptions}
            barColors={barColors}
            setBarColors={setBarColors}
            graphType={graphType}
          />
          <ActivityData
            goal={goal}
            setGoal={setGoal}
            ageValue={ageValue}
            setAgeValue={setAgeValue}
            genderValue={genderValue}
            setGenderValue={setGenderValue}
            raceValue={raceValue}
            setRaceValue={setRaceValue}
            incomeValue={incomeValue}
            setIncomeValue={setIncomeValue}
            livingValue={livingValue}
            setLivingValue={setLivingValue}
            sexualValue={sexualValue}
            setSexualValue={setSexualValue}
            mhsgValue={mhsgValue}
            setMhsgValue={setMhsgValue}
            phsgValue={phsgValue}
            setPhsgValue={setPhsgValue}
            BFIExtraHiValue={BFIExtraHiValue}
            setBFIExtraHiValue={setBFIExtraHiValue}
            setDisabledOptions={setDisabledOptions}
            barColors={barColors}
            setBarColors={setBarColors}
            graphType={graphType}
            setGraphType={setGraphType}
          />
        </div>
      </MathJaxContext>
    </MantineProvider>
  );
}
