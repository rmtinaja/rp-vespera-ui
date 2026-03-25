"use client";

import Link from "next/link";
import MarbleBlock from "../../../dialog/marble-blocks";
import "../../../scss/hero.scss";
import { ChevronLeft, SquareCheckBig } from "lucide-react";

export default function Page() {
  return (
    <section className="lawn min-h-100 w-full overflow-hidden flex">
      <div className="flex flex-col lg:flex-row w-full">
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="max-h-[400px] lg:max-h-[90%] flex items-center">
            <MarbleBlock />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-5 lg:px-10 relative">
          {/* BACK BUTTON */}
          <button
            onClick={() => {
              window.location.href = "/hero/products/lawnlots";
            }}
            className="absolute top-5 left-5 lg:top-10 lg:left-auto lg:right-10 bgAccent px-3 py-2 rounded-full shadow hover:bg-green-700 transition flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
          </button>

          {/* TITLE */}
          <h1 className="text-2xl lg:text-3xl font-bold">Regular Lawn</h1>

          {/* DESCRIPTION */}
          <p className="text-base lg:text-lg my-4 lg:my-6 leading-relaxed">
            For those who value accessibility and peace, the Regular Lawn offers
            serenity just 10 meters from the road — a space grounded in dignity
            and ease.
          </p>

          {/* DETAILS */}
          <div className="flex flex-col lg:pl-10 gap-2 text-sm lg:text-lg">
            <span className="flex flex-row gap-3">
              <SquareCheckBig />
              Lot Size: 1 meter x 2.5 meters
            </span>
            <span className="flex flex-row gap-3">
              <SquareCheckBig />
              Distance from Road: 10 meters
            </span>
            <span className="flex flex-row gap-3">
              <SquareCheckBig />
              Vault Capacity: Up to 2 full-body interments
            </span>
            <span className="flex flex-row gap-3">
              <SquareCheckBig />
              Bone Remains Capacity: Accommodates up to 8 sets of exhumed bones
            </span>
          </div>

          {/* TABLE */}
          <div className="bg-white mt-8 overflow-x-auto">
            <table className="border border-black min-w-[600px] text-sm lg:text-base">
              <thead>
                <tr className="font-semibold text-center">
                  <th className="px-4 py-2 bg-[#a8844a] border">Spot Cash</th>
                  <th className="px-4 py-2 bg-[#a8844a] border">20 Years</th>
                  <th className="px-4 py-2 bg-[#a8844a] border">10 Years</th>
                  <th className="px-4 py-2 bg-[#a8844a] border">7 Years</th>
                  <th className="px-4 py-2 bg-[#a8844a] border">5 Years</th>
                  <th className="px-4 py-2 bg-[#a8844a] border">3 Years</th>
                  <th className="px-4 py-2 bg-yellow-400 border">1 Year</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="px-4 py-2 border">37,000</td>
                  <td className="px-4 py-2 border">240</td>
                  <td className="px-4 py-2 border">460</td>
                  <td className="px-4 py-2 border">600</td>
                  <td className="px-4 py-2 border">800</td>
                  <td className="px-4 py-2 border">1,200</td>
                  <td className="px-4 py-2 border bg-yellow-400 font-bold">
                    3,220
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-10 flex justify-center">
            <button className="lot-btn  border border-black px-5 py-3 w-fit transition duration-300 hover:bg-black hover:text-white lawnlots-buttons">
              Reserve Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
