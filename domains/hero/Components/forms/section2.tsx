import Image from "next/image";

export default function Section2() {
    return (
        <>
            {/* Desktop Version (visible on lg and above) */}
            <section className="hidden lg:flex section2 w-full flex-row items-center justify-center gap-8 py-16 px-6 bg-gray-800">
                {/* Left Column: Images */}
                <div className="flex flex-col items-center gap-5 w-1/2">
                    <h1 className="text-3xl font-bold flex flex-col text-start">
                        <span>Timeless love deserves a</span>
                        <span>timeless place.</span>
                    </h1>
                    <Image
                        src="/assets/images/picc.jpg"
                        alt="Butterfly"
                        width={400}
                        height={350}
                        className="rounded-lg object-cover"
                    />
                </div>

                {/* Right Column: Heading Text */}
                <div className="flex flex-col w-1/2 text-left gap-6">
                    <h1 className="text-[clamp(1.5rem,1rem,3rem)] font-bold flex flex-col">
                        <span>Our Lawn Lots offer sacred space for</span>
                        <span>reflection and peace.</span>
                    </h1>
                    <div>
                        <a
                            href="#"
                            className="inline-block mt-6 px-6 py-3 border border-white text-white font-semibold hover:bg-gray-700 transition-colors duration-300"
                        >
                            LEARN MORE
                        </a>
                    </div>
                </div>
            </section>

            {/* Mobile/Tablet Version (visible below lg) */}
            <section className="flex lg:hidden sectionlg2 w-full flex-col items-center justify-center gap-8 py-16 px-4 sm:px-6 bg-gray-800">
                {/* Left Column: Images */}
                <div className="flex flex-col items-center sm:items-start gap-5 w-full">
                    <h1 className="text-3xl sm:text-4xl font-bold flex flex-col text-center sm:text-start">
                        <span>Timeless love deserves a</span>
                        <span>timeless place.</span>
                    </h1>
                    <Image
                        src="/assets/images/picc.jpg"
                        alt="Butterfly"
                        width={600}
                        height={350}
                        className="rounded-lg object-cover w-full sm:w-[500px] h-auto"
                    />
                </div>

                {/* Right Column: Heading Text */}
                <div className="flex flex-col w-full text-center sm:text-left gap-4 sm:gap-6">
                    <h1 className="text-xl sm:text-2xl font-bold flex flex-col">
                        <span>Our Lawn Lots offer sacred space for</span>
                        <span>reflection and peace.</span>
                    </h1>
                    <div className="flex justify-center sm:justify-start">
                        <a
                            href="#"
                            className="inline-block mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 border border-white text-white font-semibold hover:bg-gray-700 transition-colors duration-300 text-sm sm:text-base"
                        >
                            LEARN MORE
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}