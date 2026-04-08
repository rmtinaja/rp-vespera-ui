"use client";

import Image from "next/image";

export default function Section4() {
  return (
    <section className="hidden !p-0 lg:flex interment1 w-full flex-row  gap-8 py-16 px-6 bg-gray-800">
      {/* Left Column: Images */}
      <div className="h-screen w-[40%] relative">
        <Image
          src="/assets/images/page-3.png"
          alt="Butterfly"
          fill
          className="object-cover"
        />


      </div>

      {/* Right Column: Heading Text */}
      <div className="flex flex-col w-[60%] text-left ml-10 mt-10">
        <h1 className="flex flex-col text-6xl font-semibold">
          <span>STANDARD</span>
          <span>ESTATE</span>
        </h1>
        <h2 className="flex flex-col ml-15">
          <span className="text-2xl font-semibold">PHP 30,990</span>
          <span>Thoughtfully designed to honor your loved</span>
          <span>one with dignity, comfort, and care.</span>
        </h2>
        <h1 className="mt-5 font-semibold text-md">PACKAGE INCLUSIONS:</h1>
        <div className="grid md:grid-cols-2 gap-6 text-xs mt-3 ml-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>Engraved lapida</li>
            <li>Memorial program at the Grand Chapel</li>
            <li>Professional emcee to guide the ceremony</li>
            <li>Six (6) uniformed marshals for ceremonial assistance</li>
            <li>Elegant chapel backdrop and setup</li>
            <li>Memory guest slips for family and visitors</li>
            <li>Three (3) 4x4 outdoor tents for weather comfort</li>
            <li>Green carpet for the burial area</li>
            <li>Table and podium for the program</li>
            <li>Sound system for clear audio during the service</li>
            <li>Live singer for a meaningful musical tribute</li>
          </ul>

          <ul className="list-disc pl-5 space-y-2">

            <li>24 symbolic flying balloons</li>
            <li>Dedicated photographer to document the ceremony</li>
            <li>Three (3) dozen fresh local flowers</li>
            <li>Distilled water with disposable cups</li>
            <li>250 plastic chairs for guests</li>
            <li>Candles and assorted candies for tradition and reflection</li>
            <li>One (1) industrial fan for comfort</li>
            <li>Light snack packs for attendees</li>
            <button className=" text-2xl  bg-[#000] text-white font-bold px-4 py-2 rounded mt-5">
              Avail Now
            </button>
          </ul>
        </div>
      </div>
    </section>
  );
}
