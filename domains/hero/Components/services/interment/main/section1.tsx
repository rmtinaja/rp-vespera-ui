"use client";

import Image from "next/image";

export default function Section1() {
  return (
    <section className="hidden !p-0 lg:flex interment1 w-full flex-row items-center justify-center gap-8 py-16 px-6 bg-gray-800">
      {/* Left Column: Images */}


      <div className="flex flex-col w-[60%] text-center">
        <h1 className="text-[clamp(1.5rem,1rem,3rem)] font-bold flex flex-col leading-[0.9]">
          <span>Each offering is</span>
          <span>crafted for</span>
          <span>healing and</span>
          <span>remembrance.</span>
        </h1>

      </div>
      {/* Right Column: Heading Text */}
      <div className="h-screen w-[40%] relative">
        <Image
          src="/assets/images/page-1.jpg"
          alt="Butterfly"
          fill
          className="object-cover"
        />
      </div>
    </section>

  );
}
