"use client";

import Image from "next/image";
import MarbleBlock from "../../../dialog/marble-blocks";
import "../../../scss/hero.scss";
import { ChevronLeft, SquareCheckBig } from "lucide-react";

export default function Page() {
  const details = [
    "Lot Type: Junior Estate",
    "Lot Size: 6 meter x 5 meters",
    "Capacity: 9 Vaults",
    "Description: One-story building",
  ];

  const pricing = [
    { label: "Spot Cash", value: "540,000" },
    { label: "20 Years", value: "3,500" },
    { label: "10 Years", value: "6,310" },
    { label: "7 Years", value: "8,695" },
    { label: "5 Years", value: "11,270" },
    { label: "3 Years", value: "16,500" },
    { label: "1 Year", value: "47,250", highlight: true },
  ];

  return (
    <section className="lawn h-screen w-full overflow-hidden flex bg-[#f5f3ef]">
      <div className="flex w-full h-full">
        {/* LEFT */}
        <div className="w-[45%] h-full flex flex-col justify-center items-start px-12 relative">
          {/* Back Button */}
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="absolute top-10 left-10 bg-black px-4 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Title */}
          <h1 className="text-3xl font-bold m-0 tracking-tight text-gray-900">
            JUNIOR ESTATES
          </h1>

          {/* Description */}
          <p className="text-sm my-6 leading-relaxed text-gray-600 max-w-sm">
            Refined simplicity meets thoughtful design — the Junior Estate is
            ideal for those beginning to shape their family’s story of
            remembrance.
          </p>
          <div className="flex flex-col gap-3 lg:pl-6">
            {details.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-sm text-black sm:text-base lg:text-md"
              >
                <SquareCheckBig className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 hidden overflow-x-auto lg:block">
            <table className=" border border-black text-xs bg-white">
              <thead>
                <tr className="text-center font-semibold ">
                  <th className="border bg-[#a8844a] px-4 py-3">Spot Cash</th>
                  <th className="border bg-[#a8844a] px-4 py-3">20 Years</th>
                  <th className="border bg-[#a8844a] px-4 py-3">10 Years</th>
                  <th className="border bg-[#a8844a] px-4 py-3">7 Years</th>
                  <th className="border bg-[#a8844a] px-4 py-3">5 Years</th>
                  <th className="border bg-[#a8844a] px-4 py-3">3 Years</th>
                  <th className="border bg-yellow-400 px-4 py-3">1 Year</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                   <td className="border px-1 py-1">540,000</td>
                   <td className="border px-1 py-1">3,500</td>
                   <td className="border px-1 py-1">6,310</td>
                   <td className="border px-1 py-1">8,695</td>
                   <td className="border px-1 py-1">11,270</td>
                   <td className="border px-1 py-1">16,500</td>
                   <td className="border bg-yellow-400 px-1 py-1 font-bold">
                     47,250
                   </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BUTTON */}
          <div className="w-full mt-8 flex justify-center lg:mt-10 lg:justify-center">
            <button className="lawnlots-buttons lot-btn w-full max-w-[320px] rounded-full border border-black px-6 py-3 text-base font-semibold transition duration-300 hover:bg-black hover:text-white sm:w-fit sm:min-w-[220px] lg:px-8 lg:py-4 lg:text-lg">
              Avail Now
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-[50%] h-full flex justify-center items-center">
          <div className="max-h-[90%] flex items-center relative group">
            {/* Image */}
            <div className="image-animate">
              <Image
                src="/assets/images/junior.png"
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
