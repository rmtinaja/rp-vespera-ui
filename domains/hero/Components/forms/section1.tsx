import Image from "next/image";

export default function Section1() {
  return (
    <section className="text-center section1 w-full">
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Image
          src="/assets/images/butterfly.png"
          alt="Hero Image"
          width={70} // fallback for layout
          height={50}
          sizes="(max-width: 768px) 40px, 70px"
          className="w-[clamp(40px,10vw,70px)] h-auto"
        />

        <Image
          src="/assets/images/logo-hero.png"
          alt="Hero Image"
          width={300} // fallback
          height={300}
          className="w-[clamp(150px,30vw,300px)] h-auto"
        />
        <h1 className="text-xs sm:text-xs md:text-2xl lg:text-2xl font-bold text-white mt-4 flex flex-col">
          <span>Where thoughtful service meets compassion,</span>
          <span>legacy lives on</span>
        </h1>
      </div>
    </section>
  );
}
