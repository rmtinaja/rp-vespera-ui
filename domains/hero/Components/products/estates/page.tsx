"use client";

import Link from "next/link";
import MarbleBlock from "../../dialog/marble-blocks";
import "../../scss/hero.scss";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

export default function Estates() {
  return (
    <section className="lawn h-screen w-full overflow-hidden flex bg-[#f5f3ef]">
      <div className="flex w-full h-full">
        {/* LEFT */}
        <div className="w-[35%] h-full flex flex-col justify-center items-end px-12 relative">
          {/* Back Button */}
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="absolute top-10 left-50 bg-black px-4 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Title */}
          <h1 className="text-6xl font-bold m-0 tracking-tight text-gray-900">
            ESTATES
          </h1>

          {/* Description */}
          <p className="text-lg my-6 leading-relaxed text-gray-600 text-right max-w-sm items-start">
            Your foresight today becomes comfort <br /> for those you cherish
            tomorrow.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-4 lawnlots-buttons items-end">
            <Link
              href="estates/family-estate"
              className="lot-btn bg-black text-white px-6 py-3 rounded-full shadow-md transition duration-300 hover:bg-gray-800 hover:scale-105"
            >
              Family Estate
            </Link>

            <Link
              href="estates/junior-estate"
              className="lot-btn border border-black px-6 py-3 rounded-full w-fit transition duration-300 hover:bg-black hover:text-white hover:scale-105"
            >
              Junior Estate
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-[60%] h-full flex justify-center items-center">
          <div className="max-h-[90%] flex items-center relative group">
            {/* Image */}
            <div className="image-animate">
              <Image
                src="/assets/images/estate.png"
                alt="Lower base"
                width={2600}
                height={800}
                priority
                className="relative"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
