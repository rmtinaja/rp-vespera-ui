"use client";

import Image from "next/image";
import MarbleBlock from "../../../dialog/marble-blocks";
import "../../../scss/hero.scss";
import { ChevronLeft, SquareCheckBig } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const details = [
    "Lot Type: Family Estate",
    "Lot Size: 6 meter x 10 meters",
    "Capacity: 18 Vaults",
    "Description: Two-story building",
  ];

  const pricing = [
    { label: "Spot Cash", value: "1,250,000" },
    { label: "20 Years", value: "7,550" },
    { label: "10 Years", value: "14,500" },
    { label: "7 Years", value: "19,700" },
    { label: "5 Years", value: "26,000" },
    { label: "3 Years", value: "1,40,000" },
    { label: "1 Year", value: "3,110,000", highlight: true },
  ];

  return (
    <section className="lawn h-screen w-full overflow-hidden flex bg-[#f5f3ef]">
      <div className="flex w-full h-full">
        {/* LEFT */}
        <div className="w-[45%] h-full flex flex-col justify-center items-start px-12 relative">
          {/* Back Button */}
          <button
            onClick={() => {
              window.location.href = "/hero/products/estates";
            }}
            className="absolute top-10 left-10 bg-black px-4 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Title */}
          <h1 className="text-3xl font-bold m-0 tracking-tight text-gray-900">
            FAMILY ESTATES
          </h1>

          {/* Description */}
          <p className="text-sm my-6 leading-relaxed text-gray-600 max-w-sm">
            Crafted for families who believe in honoring generations. The Family
            Estate is a two-story mausoleum designed with legacy, elegance, and
            enduring care in mind.
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
                  <td className="border px-1 py-1">1,250,000</td>
                  <td className="border px-1 py-1">7,550</td>
                  <td className="border px-1 py-1">14,500</td>
                  <td className="border px-1 py-1">19,700</td>
                  <td className="border px-1 py-1">26,000</td>
                  <td className="border px-1 py-1">40,000</td>
                  <td className="border bg-yellow-400 px-1 py-1 font-bold">
                    110,000
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
                src="/assets/images/family.png"
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
