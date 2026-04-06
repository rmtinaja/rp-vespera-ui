import React from "react";

export default function Loading({
    text = "Loading...",
}: {
    text?: string;
}) {
    return (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2 bg-white px-5 py-4 rounded-lg shadow-md border border-[#e8e3da]">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1a1a2e]" />
                <p className="text-sm text-[#5a5040] font-medium">{text}</p>
            </div>
        </div>
    );
}