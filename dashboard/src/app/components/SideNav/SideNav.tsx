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
}: Props) {
    const [centerText, setCenterText] = useState("mt-3 ml-5");
    const [mousePointer, setMousePointer] = useState("cursor-pointer");
    const [sideNavColor, setSideNavColor] = useState("");
    const [opened, setOpened] = useState(true);
    const [outerStyle, setOuterStyle] = useState(
        "flex flex-col items-center bg-white p-4 h-fit w-[375px] fixed top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 rounded-md shadow-custom",
    );
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    const [filters, setFilters] = useState<string[]>([]);

    const titleColors: { [key: string]: string } = {
        Sleep: "!bg-sleepText",
        "Physical Health": "!bg-physicalText",
        "Emotional Health": "!bg-emotionalText",
        Productivity: "!bg-productivityText",
        "Social Wellness": "!bg-socialText",
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

    const comboboxItems = demoValues.map((item) => (
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
                    >
                        {option}
                    </Combobox.Option>
                );
            })}
        </Combobox.Group>
    ));

    function updateFilters(fil: string) {
        let index = filters.indexOf(fil);
        let demoInfo = demoValues.find((x) => x.title === fil.split(":")[0]);
        if (index > -1) {
            filters.splice(index, 1);
            setFilters([...filters]);

            if (demoInfo !== undefined) {
                let groupIndex = demoInfo.groupValue.indexOf(fil.split("=")[1]);
                demoInfo.groupValue.splice(groupIndex, 1);
                demoInfo.changeGroupValue([...demoInfo.groupValue]);
            }
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

    useEffect(() => {
        if (opened) {
            setOuterStyle(
                "flex flex-col items-center bg-white p-4 h-fit w-[375px] fixed top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 rounded-md shadow-custom",
            );
            setBgColor("bg-zinc-100");
        } else {
            setOuterStyle(
                "h-auto min-h-screen w-1/5 flex flex-col items-center overflow-y-auto " +
                    sideNavColor,
            );
            setBgColor("bg-white");
        }
    }, [opened]);

    return (
        <div className={outerStyle}>
            <div className="w-full flex flex-col items-center">
                {goal == "" && (
                    <h1 className="mt-5 tracking-widest text-2xl w-full items-center uppercase text-center text-gray-800">
                        Select a Goal
                    </h1>
                )}
                <div className="w-full">
                    {goals.map((goalItem, index) => {
                        if (goal == "" || goal == goalItem.goal) {
                            return (
                                <SideNavGoal
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
                            }}
                        >
                            Select another goal{" "}
                        </div>
                    )}
                </div>
                {goal != "" && (
                    <div className="w-full">
                        <h1
                            className={
                                "mt-2 p-2 tracking-widest text-xl w-full items-center uppercase text-center " +
                                titleColors[goal]
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
                                        rightSection={<Combobox.Chevron />}
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
                                        {comboboxItems}
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
                                                    titleColors[goal] +
                                                    " my-[0.05rem] input-desktop"
                                                }
                                                withRemoveButton
                                                onRemove={() => {
                                                    updateFilters(fil);
                                                }}
                                            >
                                                <span className="italic">
                                                    {
                                                        fil
                                                            .split("=")[0]
                                                            .split(":")[0]
                                                    }
                                                    :
                                                </span>

                                                <span className="font-semibold">
                                                    {
                                                        fil
                                                            .split("=")[0]
                                                            .split(":")[1]
                                                    }
                                                </span>
                                            </Pill>
                                            <Pill
                                                size="xs"
                                                className={
                                                    titleColors[goal] +
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
                                                            .split("=")[0]
                                                            .split(":")[0]
                                                    }
                                                    :
                                                </span>

                                                <span className="font-semibold">
                                                    {
                                                        fil
                                                            .split("=")[0]
                                                            .split(":")[1]
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
    );
}
