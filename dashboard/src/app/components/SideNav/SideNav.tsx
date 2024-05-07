import { useState, useEffect } from "react";
import Image from "next/image";
import SideNavGoal from "./SideNavGoal";
import {
    Group,
    Combobox,
    useCombobox,
    InputBase,
    Input,
    Pill,
} from "@mantine/core";
import "./SideNav.css";

interface Props {
    goal: string;
    setGoal: Function;
    setBgColor: Function;
    ageValue: string[];
    setAgeValue: Function;
    genderValue: string[];
    setGenderValue: Function;
    raceValue: string[];
    setRaceValue: Function;
    incomeValue: string[];
    setIncomeValue: Function;
    livingValue: string[];
    setLivingValue: Function;
    sexualValue: string[];
    setSexualValue: Function;
    mhsgValue: string[];
    setMhsgValue: Function;
    phsgValue: string[];
    setPhsgValue: Function;
    BFIExtraHiValue: string[];
    setBFIExtraHiValue: Function;
    disabledOptions: string[];
    barColors: string[];
    setBarColors: Function;
    graphType: string;
}

export default function SideNav({
    goal,
    setGoal,
    setBgColor,
    ageValue,
    setAgeValue,
    genderValue,
    setGenderValue,
    raceValue,
    setRaceValue,
    incomeValue,
    setIncomeValue,
    livingValue,
    setLivingValue,
    sexualValue,
    setSexualValue,
    mhsgValue,
    setMhsgValue,
    phsgValue,
    setPhsgValue,
    BFIExtraHiValue,
    setBFIExtraHiValue,
    disabledOptions,
    barColors,
    setBarColors,
    graphType,
}: Props) {
    const [centerText, setCenterText] = useState("mt-3 ml-5");
    const [allcenterText, setAllCenterText] = useState("mt-3 ml-5");
    const [mousePointer, setMousePointer] = useState("cursor-pointer");
    const [sideNavColor, setSideNavColor] = useState("");
    const [sideNavContainer, setSideNavContainer] = useState(
        "flex m-auto justify-center items-center",
    );
    const [outerContainer, setOuterContainer] = useState(
        "flex flex-col m-auto justify-center items-center",
    );
    const [opened, setOpened] = useState(true);
    const [outerStyle, setOuterStyle] = useState(
        "flex flex-col items-center bg-white p-4 h-fit w-[375px] rounded-md shadow-custom m-8",
    );
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    const [filters, setFilters] = useState<string[]>([]);
    const [selectAnotherGoal, setSelectAnotherGoal] = useState<string>(
        "Select another goal",
    );
    const [clearBarColors, setClearBarColors] = useState(false);

    const pillColors: { [key: string]: string } = {
        Sleep: "!bg-sleepText",
        "Physical Health": "!bg-physicalText",
        "Emotional Health": "!bg-emotionalText",
        Productivity: "!bg-productivityText",
        "Social Wellness": "!bg-socialText",
        All: "!bg-[#7a746e]",
    };

    const headerColors: { [key: string]: string } = {
        Sleep: "!bg-sleepHeader",
        "Physical Health": "!bg-physicalHeader",
        "Emotional Health": "!bg-emotionalHeader",
        Productivity: "!bg-productivityHeader",
        "Social Wellness": "!bg-socialHeader",
        All: "bg-[#2B2927]",
    };

    const goals = [
        {
            goal: "Sleep",
            iconImg: "sleep_icon.png",
            alt: "sleep icon",
            goalImg: "sleep.png",
            goalColor: "sleep",
        },
        {
            goal: "Physical Health",
            iconImg: "exercise_icon.png",
            alt: "physical health icon",
            goalImg: "physical_health.png",
            goalColor: "physical",
        },
        {
            goal: "Emotional Health",
            iconImg: "emotions_icon.png",
            alt: "emotional health icon",
            goalImg: "emotional_health.png",
            goalColor: "emotional",
        },
        {
            goal: "Productivity",
            iconImg: "improvement_icon.png",
            alt: "productivity icon",
            goalImg: "productivity.png",
            goalColor: "productivity",
        },
        {
            goal: "Social Wellness",
            iconImg: "social_icon.png",
            alt: "social wellness icon",
            goalImg: "social wellness.png",
            goalColor: "social",
        },
    ];

    const demoValues = [
        {
            value: "Age",
            title: "Age Range",
            groupValue: ageValue,
            changeGroupValue: setAgeValue,
            options: ["18-29", "30-49", "50+"],
        },
        {
            value: "Gender",
            title: "Gender",
            groupValue: genderValue,
            changeGroupValue: setGenderValue,
            options: ["Male", "Female"],
        },
        {
            value: "Race",
            title: "Race/Ethnicity",
            groupValue: raceValue,
            changeGroupValue: setRaceValue,
            options: ["White", "Minority"],
        },
        {
            value: "Income",
            title: "Income",
            groupValue: incomeValue,
            changeGroupValue: setIncomeValue,
            options: ["less than $49,999", "Greater than $50,000"],
        },
        {
            value: "Location",
            title: "Location",
            groupValue: livingValue,
            changeGroupValue: setLivingValue,
            options: ["Rural", "Suburban/City"],
        },
        {
            value: "Sexual Orientation",
            title: "Sexual Orientation",
            groupValue: sexualValue,
            changeGroupValue: setSexualValue,
            options: ["Heterosexual", "LGBTQAI+"],
        },
        {
            value: "MHSG",
            title: "MHSG",
            groupValue: mhsgValue,
            changeGroupValue: setMhsgValue,
            options: ["No Mental Health Diagnoses", "Mental Health Diagnoses"],
        },
        {
            value: "PHSG",
            title: "PHSG",
            groupValue: phsgValue,
            changeGroupValue: setPhsgValue,
            options: [
                "No Physical Health Problems",
                "Physical Health Problems",
            ],
        },
        {
            value: "BFIExtraHi",
            title: "BFIExtraHi",
            groupValue: BFIExtraHiValue,
            changeGroupValue: setBFIExtraHiValue,
            options: ["Low Extroversion", "High Extroversion"],
        },
    ];

    const filterOptions = demoValues.map((item) => {
        if (goal != "All") {
            return (
                <Combobox.Group label={item.title} key={item.value}>
                    {item.options.map((option, index) => {
                        let curIndex = structuredClone(index).toString();

                        if (["Age Range", "Gender"].includes(item.title)) {
                            curIndex = String(Number(curIndex) + 1);
                        } else if (
                            [
                                "Race/Ethnicity",
                                "Income",
                                "Location",
                                "Sexual Orientation",
                            ].includes(item.title)
                        ) {
                            curIndex = option;
                        } else if (item.title == "BFIExtraHi") {
                            curIndex = option.split(" ")[0].toLowerCase();
                        }

                        return (
                            <Combobox.Option
                                value={
                                    item.title +
                                    ": " +
                                    option +
                                    "=" +
                                    curIndex.toString()
                                }
                                disabled={disabledOptions.includes(
                                    item.value + "=" + curIndex.toString(),
                                )}
                                key={index}
                            >
                                {option}
                            </Combobox.Option>
                        );
                    })}
                </Combobox.Group>
            );
        } else {
            return (
                <Combobox.Option key={item.title} value={item.title}>
                    {item.title}
                </Combobox.Option>
            );
        }
    });

    function updateFilters(fil: string) {
        let index = filters.indexOf(fil);
        let demoInfo = demoValues.find((x) => x.title === fil.split(":")[0]);
        if (index > -1) {
            // remove filter
            if (
                !(
                    goal == "All" &&
                    graphType == "Sankey Diagram" &&
                    filters.length == 1
                )
            ) {
                filters.splice(index, 1);
                setFilters([...filters]);

                if (demoInfo !== undefined) {
                    let groupIndex = demoInfo.groupValue.indexOf(
                        fil.split("=")[1],
                    );
                    demoInfo.groupValue.splice(groupIndex, 1);
                    demoInfo.changeGroupValue([...demoInfo.groupValue]);
                }
            }
        } else {
            // add filter
            if (goal == "All" && graphType == "Sankey Diagram") {
                if (demoInfo !== undefined) {
                    console.log("hey");
                    console.log(demoInfo);
                    demoInfo.groupValue.splice(0, 1);
                    demoInfo.changeGroupValue([...demoInfo.groupValue]);
                    demoInfo.changeGroupValue([fil.split("=")[1]]);

                    console.log(demoInfo);
                }
                setFilters([fil]);
            } else {
                setFilters([...filters, fil]);

                if (demoInfo !== undefined) {
                    demoInfo.changeGroupValue([
                        ...demoInfo.groupValue,
                        fil.split("=")[1],
                    ]);
                }
            }
        }
    }

    useEffect(() => {
        if (opened) {
            setOuterStyle(
                "flex flex-col items-center bg-white p-4 h-fit w-[375px] rounded-md shadow-custom m-8",
            );
            setSideNavContainer("flex m-auto justify-center items-center");
            setOuterContainer(
                "flex flex-col m-auto justify-center items-center",
            );
            setBgColor("bg-zinc-100");
        } else {
            if (goal == "All") {
                setOuterStyle(
                    "h-auto min-h-screen w-1/5 fixed flex flex-col items-center overflow-y-auto " +
                        sideNavColor,
                );
                setSelectAnotherGoal("Select a specific goal");
            } else {
                setOuterStyle(
                    "h-auto min-h-screen w-1/5 fixed flex flex-col items-center overflow-y-auto " +
                        sideNavColor,
                );
                setSelectAnotherGoal("Select another goal");
            }
            setSideNavContainer("w-1/5");
            setOuterContainer("w-1/5");
            setBgColor("bg-white");
        }
    }, [opened]);

    return (
        <div className={outerContainer}>
            <div className={sideNavContainer}>
                {goal == "" && (
                    <div className="w-[375px] text-3xl text-justify m-8 font-light">
                        We asked{" "}
                        <span className="animated-text font-semibold">
                            1000 people
                        </span>{" "}
                        what aspects of health they excelled in and the most
                        effective wellness activities they employed.
                        <br />
                        <br />
                        <span className="animated-text font-semibold">
                            Select a health goal
                        </span>{" "}
                        to explore what works for people like you!
                    </div>
                )}
                <div className={outerStyle}>
                    <div className="w-full flex flex-col items-center">
                        {/*{goal == "" && (
                        <h1 className="mt-5 tracking-widest text-2xl w-full items-center uppercase text-center text-gray-800">
                            Select a Goal
                        </h1>
                    )}*/}
                        <div className="w-full">
                            {goal == "All" && (
                                <SideNavGoal
                                    goal={"Select goals to display"}
                                    iconImg={""}
                                    alt={""}
                                    setGoal={setGoal}
                                    curGoal={goal}
                                    goalImg={""}
                                    centerText={allcenterText}
                                    setCenterText={setAllCenterText}
                                    mousePointer={mousePointer}
                                    setMousePointer={setMousePointer}
                                    goalColor={""}
                                    setOpened={setOpened}
                                    setSideNavColor={setSideNavColor}
                                    barColors={barColors}
                                    setBarColors={setBarColors}
                                    clearBarColors={clearBarColors}
                                    setClearBarColors={setClearBarColors}
                                    graphType={graphType}
                                />
                            )}
                            {goals.map((goalItem, index) => {
                                if (
                                    goal == "" ||
                                    goal == goalItem.goal ||
                                    goal == "All"
                                ) {
                                    return (
                                        <SideNavGoal
                                            key={index}
                                            goal={goalItem.goal}
                                            iconImg={goalItem.iconImg}
                                            alt={goalItem.alt}
                                            setGoal={setGoal}
                                            curGoal={goal}
                                            goalImg={goalItem.goalImg}
                                            centerText={centerText}
                                            setCenterText={setCenterText}
                                            mousePointer={mousePointer}
                                            setMousePointer={setMousePointer}
                                            goalColor={goalItem.goalColor}
                                            setOpened={setOpened}
                                            setSideNavColor={setSideNavColor}
                                            barColors={barColors}
                                            setBarColors={setBarColors}
                                            clearBarColors={clearBarColors}
                                            setClearBarColors={
                                                setClearBarColors
                                            }
                                            graphType={graphType}
                                        />
                                    );
                                }
                            })}

                            {goal != "" && (
                                <div
                                    className="text-center cursor-pointer italic text-xs mb-3 mt-2 select-animated after:bg-gray-600 w-fit m-auto"
                                    onClick={() => {
                                        setCenterText("mt-3 ml-5");
                                        setGoal("");
                                        setMousePointer("cursor-pointer");
                                        setOpened(true);
                                        setAgeValue([]);
                                        setGenderValue([]);
                                        setRaceValue([]);
                                        setIncomeValue([]);
                                        setLivingValue([]);
                                        setSexualValue([]);
                                        setMhsgValue([]);
                                        setPhsgValue([]);
                                        setBFIExtraHiValue([]);
                                        setFilters([]);
                                        setSideNavColor("");
                                        setBarColors([]);
                                        console.log("hi?");
                                        setClearBarColors(true);
                                    }}
                                >
                                    {selectAnotherGoal}
                                </div>
                            )}
                        </div>
                        {goal != "" && (
                            <div className="w-full">
                                <h1
                                    className={
                                        "mt-2 p-2 tracking-widest text-xl w-full items-center uppercase text-center " +
                                        headerColors[goal] +
                                        (goal != "All"
                                            ? " text-gray-800"
                                            : " text-slate-50")
                                    }
                                >
                                    Filters
                                </h1>
                                <div className="mx-2 mt-2">
                                    <Combobox
                                        store={combobox}
                                        withinPortal={false}
                                        onOptionSubmit={(fil) => {
                                            updateFilters(fil);

                                            combobox.closeDropdown();
                                        }}
                                    >
                                        <Combobox.Target>
                                            <InputBase
                                                component="button"
                                                type="button"
                                                className="mb-3"
                                                pointer
                                                rightSection={
                                                    <Combobox.Chevron />
                                                }
                                                onClick={() =>
                                                    combobox.toggleDropdown()
                                                }
                                                rightSectionPointerEvents="none"
                                            >
                                                {
                                                    <Input.Placeholder>
                                                        Select a Filter
                                                    </Input.Placeholder>
                                                }
                                            </InputBase>
                                        </Combobox.Target>

                                        <Combobox.Dropdown>
                                            <Combobox.Options
                                                mah={300}
                                                className="overflow-y-auto"
                                            >
                                                {filterOptions}
                                            </Combobox.Options>
                                        </Combobox.Dropdown>
                                    </Combobox>
                                    <div>
                                        <Pill.Group>
                                            {filters.map((fil, index) => (
                                                <div key={index}>
                                                    <Pill
                                                        size="lg"
                                                        className={
                                                            pillColors[goal] +
                                                            " my-[0.05rem] input-desktop" +
                                                            (goal == "All"
                                                                ? " !text-white"
                                                                : "")
                                                        }
                                                        withRemoveButton
                                                        onRemove={() => {
                                                            updateFilters(fil);
                                                        }}
                                                    >
                                                        <span className="italic">
                                                            {
                                                                fil
                                                                    .split(
                                                                        "=",
                                                                    )[0]
                                                                    .split(
                                                                        ":",
                                                                    )[0]
                                                            }
                                                            :
                                                        </span>

                                                        <span className="font-semibold">
                                                            {
                                                                fil
                                                                    .split(
                                                                        "=",
                                                                    )[0]
                                                                    .split(
                                                                        ":",
                                                                    )[1]
                                                            }
                                                        </span>
                                                    </Pill>
                                                    <Pill
                                                        size="xs"
                                                        className={
                                                            pillColors[goal] +
                                                            " my-[0.05rem] input-mobile"
                                                        }
                                                        withRemoveButton
                                                        onRemove={() => {
                                                            updateFilters(fil);
                                                        }}
                                                    >
                                                        <span className="italic">
                                                            {
                                                                fil
                                                                    .split(
                                                                        "=",
                                                                    )[0]
                                                                    .split(
                                                                        ":",
                                                                    )[0]
                                                            }
                                                            :
                                                        </span>

                                                        <span className="font-semibold">
                                                            {
                                                                fil
                                                                    .split(
                                                                        "=",
                                                                    )[0]
                                                                    .split(
                                                                        ":",
                                                                    )[1]
                                                            }
                                                        </span>
                                                    </Pill>
                                                </div>
                                            ))}
                                        </Pill.Group>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {goal == "" && (
                <div className="ml-2 my-3 text-gray-800 text-xl text-center">
                    Alternatively, compare all goals{" "}
                    <span
                        className={
                            "hover:after:bg-gray-300 after:bg-gray-300 " +
                            mousePointer +
                            (goal == "" ? " goal-animated" : "")
                        }
                        onClick={(e) => {
                            setOpened(false);
                            setGoal("All");
                            setCenterText("justify-center cursor-pointer");
                            setAllCenterText(
                                "justify-center bg-[#2B2927] text-slate-50",
                            );
                            setMousePointer("cursor-pointer");
                            setSideNavColor("bg-[#F0F0F0]");
                        }}
                    >
                        here
                    </span>
                    !
                </div>
            )}
        </div>
    );
}
