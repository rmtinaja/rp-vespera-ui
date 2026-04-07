"use client";

import Image from "next/image";

export default function Section3() {
  return (
    <section className="hidden !p-0 lg:flex interment1 w-full flex-row  gap-8 py-16 px-6 bg-gray-800">
      {/* Left Column: Images */}


      <div className="flex flex-col w-[60%] text-left ml-10 mt-10">
        <h1 className="flex flex-col text-6xl font-semibold">
          <span>STANDARD</span>
          <span>LAWN</span>
        </h1>
        <h2 className="flex flex-col ml-15">
          <span className="text-2xl font-semibold">PHP 40,500</span>
          <span>Thoughtfully designed to honor your loved</span>
          <span>one with dignity, comfort, and care.</span>
        </h2>
        <h1 className="mt-5 font-semibold text-md">PACKAGE INCLUSIONS:</h1>
        <div className="grid md:grid-cols-2 gap-6 text-xs mt-3 ml-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>Grave preparation (digging and backfilling)</li>
            <li>One (1) reinforced concrete vault with cover</li>
            <li>Engraved Lapida</li>
            <li>Memorial program at the Grand Chapel</li>
            <li>Professional emcee to guide the ceremony</li>
            <li>Six (6) uniformed marshalls for ceremonial assistance</li>
            <li>Elegant chapel backdrop and setup</li>
            <li>Memory guest slips for family and visitors</li>
            <li>Three (3) 4x4 outdoor tents for weather comfort</li>
            <li>Green carpet for the burial area</li>
            <li>Table and podium for the program</li>
          </ul>

          <ul className="list-disc pl-5 space-y-2">
            <li>Sound system for clear audio during the service</li>
            <li>Live singer for a meaningful musical tribute</li>
            <li>24 symbolic flying balloons</li>
            <li>Dedicated photographer to document the ceremony</li>
            <li>Three (3) dozen fresh local flowers</li>
            <li>Distilled water with disposable cups</li>
            <li>250 plastic chairs for guests</li>
            <li>Candles and assorted candies for tradition and reflection</li>
            <li>One (1) industrial fan for comfort</li>
            <li>Light snack packs for attendees</li>
          </ul>
        </div>
      </div>
      {/* Right Column: Heading Text */}
      <div className="h-screen w-[40%] relative">
        <Image
          src="/assets/images/learn_more_2_3.jpg"
          alt="Butterfly"
          fill
          className="object-cover"
        />

        <button className="absolute text-2xl top-[90%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-dark font-bold px-4 py-2 rounded">
          Avail Now
        </button>
      </div>
    </section>
  );
}
