"use client";

import Link from "next/link";
import MarbleBlock from "../../dialog/marble-blocks";
import "../../scss/hero.scss";
import { ChevronLeft } from "lucide-react";
export default function Estates() {
  return (
    <section className="lawn h-screen w-full overflow-hidden flex">
      <div className="flex w-full h-full">
        <div className="w-1/2 h-full flex justify-center items-center">
          <div className="max-h-[90%] flex items-center">
            <MarbleBlock />
          </div>
        </div>

        <div className="w-1/2 h-full flex flex-col justify-center px-10">
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="absolute top-10 right-50 bgAccent px-4 py-3 rounded-full shadow hover:bg-green-700 transition flex items-center justify-center"
          >
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>
          <h1 className="text-6xl font-bold m-0">ESTATES</h1>

          <p className="text-lg my-6 leading-relaxed">
            Your foresight today becomes comfort <br /> for those you cherish tomorrow.
          </p>

          <div className="flex flex-col gap-4 lawnlots-buttons ">
            <Link
              href="estates/family-estate"
              className="lot-btn  border border-black px-5 py-3 w-fit transition duration-300 hover:bg-black hover:text-white"
            >
              Family Estate
            </Link>
            <Link
              href="estates/junior-estate"
              className="lot-btn  border border-black px-5 py-3 w-fit transition duration-300 hover:bg-black hover:text-white"
            >
              Junior Estate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
