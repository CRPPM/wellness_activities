import { useState } from "react";
import Image from "next/image";

interface Props {
    goal: string | null;
    iconImg: string | null;
    alt: string | null;
    setGoal: Function;
    curGoal: string | null;
    goalImg: string | null;
}
export default function SideNavGoal({
    goal,
    iconImg,
    alt,
    setGoal,
    curGoal,
    goalImg,
}: Props) {
    const [centerText, setCenterText] = useState("ml-5");
    let iconSrc = "/images/" + iconImg;
    let goalSrc = "/images/" + goalImg;

    function handleGoal() {
        if (curGoal != goal) {
            setGoal(goal);
            setCenterText("justify-center");
        } else {
            setGoal("");
            setCenterText("mt-3 ml-5");
        }
    }

    return (
        <div className="flex flex-col" onClick={handleGoal}>
            {curGoal != "" && (
                <div className="w-4/5 m-auto mt-4 mb-2">
                    <Image src={goalSrc} width={300} height={20} />
                </div>
            )}
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
                <h2 className="cursor-pointer ml-2 my-3 uppercase text-lg">
                    {goal}
                </h2>
            </div>
        </div>
    );
}
