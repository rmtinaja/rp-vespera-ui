"use client";

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
    <section className="lawn min-h-screen w-full overflow-hidden">
      <div className="relative mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col lg:flex-row">
        {/* BACK BUTTON */}
        <button
          onClick={() => {
            window.location.href = "/hero/products/estates";
          }}
          className="absolute left-4 top-4 z-20 flex items-center justify-center rounded-full bgAccent p-2 shadow-md transition hover:bg-green-700 lg:left-auto lg:right-8 lg:top-8 lg:p-3"
        >
          <ChevronLeft className="h-5 w-5 text-white lg:h-7 lg:w-7" />
        </button>

        {/* LEFT COLUMN */}
        <div className="flex w-full items-center justify-center px-4 pt-16 sm:px-6 lg:w-1/2 lg:px-8 lg:pt-0">
          <div className="flex w-full max-w-[520px] items-center justify-center">
            <div className="scale-[0.88] sm:scale-100 lg:scale-100">
              <MarbleBlock />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex w-full flex-col justify-center px-4 pb-10 pt-6 sm:px-6 lg:w-1/2 lg:px-10 lg:py-16">
          {/* TITLE */}
          <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            JUNIOR ESTATE
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-4 text-sm leading-7 text-black/90 sm:text-base lg:mt-6 lg:text-lg">
            Refined simplicity meets thoughtful design — the Junior Estate is
            ideal for those beginning to shape their family’s story of
            remembrance.
          </p>

          {/* DETAILS */}
          <div className="mt-6 flex flex-col gap-3 lg:mt-8 lg:pl-6">
            {details.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-sm text-black sm:text-base lg:text-lg"
              >
                <SquareCheckBig className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* MOBILE CARD TABLE */}
          <div className="mt-8 overflow-x-auto lg:hidden">
            <table className="w-full border border-black text-[10px] sm:text-xs">
              <thead>
                <tr className="text-center font-semibold">
                  <th className="border bg-[#a8844a] px-1 py-1">Cash</th>
                  <th className="border bg-[#a8844a] px-1 py-1">20 years</th>
                  <th className="border bg-[#a8844a] px-1 py-1">10 years</th>
                  <th className="border bg-[#a8844a] px-1 py-1">7 years</th>
                  <th className="border bg-[#a8844a] px-1 py-1">5 years</th>
                  <th className="border bg-[#a8844a] px-1 py-1">3 years</th>
                  <th className="border bg-yellow-400 px-1 py-1">1 year</th>
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

          {/* DESKTOP / TABLET TABLE */}
          <div className="mt-8 hidden overflow-x-auto lg:block">
            <table className="min-w-[700px] border border-black bg-white text-sm lg:text-base">
              <thead>
                <tr className="text-center font-semibold">
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
          <div className="mt-8 flex justify-center lg:mt-10 lg:justify-start">
            <button className="lawnlots-buttons lot-btn w-full max-w-[320px] rounded-full border border-black px-6 py-3 text-base font-semibold transition duration-300 hover:bg-black hover:text-white sm:w-fit sm:min-w-[220px] lg:px-8 lg:py-4 lg:text-lg">
              Avail Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
