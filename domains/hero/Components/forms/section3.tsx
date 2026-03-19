import Image from "next/image";


export default function Section3() {
    return (
        <>
            {/* Desktop Version (visible on lg and above) */}
            <section className="section1 relative desktop lg:flex w-full flex-row items-center justify-center gap-8 py-16 px-6 bg-gray-800 overflow-hidden">

                {/* 🔥 50% Background Overlay */}
                <div className="absolute inset-0 bg-[#b38b55]/50 z-10"></div>

                {/* Left Column */}
                <div className="mx-10 relative z-20 flex flex-col w-1/2 items-start text-left gap-6">
                    <h1 className="text-[clamp(1.5rem,3vw,3rem)] font-serif text-white leading-snug">
                        Interment services that secure what truly matters,
                        because true strength is in quiet, loving preparation
                    </h1>

                    <div className="flex justify-start w-full">
                        <a
                            href="#"
                            className="inline-block mt-6 px-6 py-3 border border-white text-white font-semibold hover:bg-gray-700 transition-colors duration-300"
                        >
                            LEARN MORE
                        </a>
                    </div>
                </div>

                {/* Right Column */}
                <div className="relative z-20 flex flex-col gap-5 w-1/2">
                    <Image
                        src="/assets/images/ballons.jpg"
                        alt="Ballons"
                        width={900}
                        height={700}
                        className="rounded-lg object-cover w-full h-auto"
                        priority
                    />
                </div>
            </section>

            {/* Mobile Version (visible below lg) */}
            <section className="relative flex mobile w-full min-h-[500px] bg-gray-800 overflow-hidden">

                {/* Background Overlay */}
                <div className="absolute inset-0 bg-[#b38b55]/50 z-10"></div>

                {/* Background Image with Overlay (optional - if you want image as background) */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/images/ballons.jpg"
                        alt="Background"
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="relative z-20 flex flex-col items-center justify-center min-h-[500px] px-6 py-12 text-center">

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-serif text-white leading-snug mb-8 max-w-md">
                        Interment services that secure what truly matters,
                        because true strength is in quiet, loving preparation
                    </h1>

                    {/* CTA Button */}
                    <a
                        href="#"
                        className="inline-block px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white hover:text-[#b38b55] transition-all duration-300 text-center min-w-[200px]"
                    >
                        LEARN MORE
                    </a>

                    {/* Simple decorative element */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                        <span className="w-2 h-2 bg-white/50 rounded-full"></span>
                        <span className="w-2 h-2 bg-white/80 rounded-full"></span>
                        <span className="w-2 h-2 bg-white/50 rounded-full"></span>
                    </div>
                </div>
            </section>
        </>
    );
}