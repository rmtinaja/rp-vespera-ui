"use client";

import Link from "next/link";
import MarbleBlock from "../../dialog/marble-blocks";
import "../../scss/hero.scss";
import { ChevronLeft } from "lucide-react";
export default function CommunityVault() {
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
          <h1 className="text-6xl font-bold m-0">Community Vault</h1>

          <p className="text-lg my-6 leading-relaxed">
            Our community vaults offer an affordable and convenient option for
            the interment of your loved ones. These apartment-style spaces
            provide a dignified and peaceful resting place. For only ₱28 ,000 at
            need.
          </p>
          <div className="w-full overflow-x-auto">
            <table className="min-w-[700px] border border-black bg-[#b7a27a] text-sm lg:text-base">
              <thead>
                <tr className="text-center font-semibold">
                  <th className="border bg-[#a8844a] px-4 py-3">Vault Level</th>
                  <th className="border bg-[#a8844a] px-4 py-3">
                    Spot Cash Rental Fee
                    <br />
                    with Interment Program
                  </th>
                  <th className="border bg-[#a8844a] px-4 py-3">
                    Prevailing Rental
                    <br />
                    After 5 Years
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="text-center">
                  <td className="border px-4 py-3">4th Level</td>
                  <td className="border px-4 py-3">22,000</td>

                  {/* merged cell across 4 rows */}
                  <td
                    rowSpan={4}
                    className="border px-4 py-3 align-middle font-medium"
                  >
                    3,000 Per Year
                  </td>
                </tr>

                <tr className="text-center">
                  <td className="border px-4 py-3">3rd Level</td>
                  <td className="border px-4 py-3">28,000</td>
                </tr>

                <tr className="text-center">
                  <td className="border px-4 py-3">2nd Level</td>
                  <td className="border px-4 py-3">28,000</td>
                </tr>

                <tr className="text-center">
                  <td className="border px-4 py-3">1st Level</td>
                  <td className="border px-4 py-3">28,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex justify-center lg:mt-10 lg:justify-center">
            <button className="lawnlots-buttons lot-btn w-full max-w-[320px] rounded-full border border-black px-6 py-3 text-base font-semibold transition duration-300 hover:bg-black hover:text-white sm:w-fit sm:min-w-[220px] lg:px-8 lg:py-4 lg:text-lg">
              Avail Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
