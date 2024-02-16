import { useState } from "react";
import Image from "next/image";

interface Props {
    goal: string | null;
    goalImg: string | null;
    alt: string | null;
}
export default function SideNavGoal({ goal, goalImg, alt }: Props) {
    let imgSrc = "/images/" + goalImg;
    return (
        <div className="flex my-3 ml-5">
            <div className="flex items-center" style={{ width: "30px" }}>
                <Image
                    src={imgSrc}
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
    );
}
