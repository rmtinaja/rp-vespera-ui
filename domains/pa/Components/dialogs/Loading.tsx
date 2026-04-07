import React from "react";

export default function Loading({
  text = "Loading...",
}: {
  text?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 bg-white dark:bg-gray-800 px-6 py-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Animated Pulsing Dots */}
        <div className="flex gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce animation-delay-0"></span>
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce animation-delay-200"></span>
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce animation-delay-400"></span>
        </div>

        {/* Loading Text */}
        <p className="text-sm text-gray-700 dark:text-gray-200 font-medium text-center">
          {text}
        </p>
      </div>
    </div>
  );
}