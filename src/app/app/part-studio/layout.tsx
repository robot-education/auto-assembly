"use client";
import { ReactNode } from "react";
import { GenerateAssemblyCard } from "./generate-assembly/generate-assembly";

export default function PartStudioLayout(props: {
    children: ReactNode;
}): JSX.Element {
    return (
        <>
            <GenerateAssemblyCard />
            {props.children}
        </>
    );
}
