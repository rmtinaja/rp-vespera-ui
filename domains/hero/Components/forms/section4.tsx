import { Video } from "lucide-react";
import Image from "next/image";

export default function Section4() {
    return (
        <>
            {/* Desktop Version (visible on lg and above) */}
            <section className="section2 relative hidden lg:flex w-full flex-row items-center justify-center gap-8 py-16 px-6 bg-gray-800 overflow-hidden">

                {/* Right Column - Video */}
                <div className="relative z-20 flex flex-col gap-5 w-1/2">
                    <video
                        src="/assets/videos/video1.mp4"
                        width={900}
                        height={700}
                        className="rounded-lg object-cover w-full h-auto shadow-2xl"
                        controls
                        autoPlay
                        muted
                        loop
                        aria-label="Butterfly video showing a monarch butterfly in flight"
                    />
                </div>

                {/* Left Column - Text */}
                <div className="mx-10 relative z-20 flex flex-col w-1/2 items-center text-left gap-6">
                    <h1 className="text-[clamp(1.5rem,3vw,3rem)] flex flex-col font-serif w-2/3 text-center text-white leading-snug">
                        <span>Prestige isn't built</span>
                        <span>in marble,</span>
                        <span>but in meaning.</span>
                    </h1>

                    <div className="flex justify-center w-full">
                        <a
                            href="#"
                            className="inline-block rounded-full bg-[#0a352d] mt-6 px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white hover:text-[#0a352d] transition-all duration-300"
                        >
                            ONLINE VISIT
                        </a>
                    </div>
                </div>
            </section>

            {/* Mobile Version (visible below lg) */}
            <section className="relative flex lg:hidden w-full flex-col bg-gray-800 overflow-hidden py-12 px-4 min-h-[600px]">

                {/* Background Video with Overlay for Mobile */}
                <div className="absolute inset-0 z-0">
                    <video
                        src="/assets/videos/video1.mp4"
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        aria-label="Butterfly video background"
                    />
                    <div className="absolute inset-0 bg-black/50 z-10"></div>
                </div>

                {/* Content Container */}
                <div className="relative z-20 container mx-auto flex flex-col items-center justify-center min-h-[500px]">

                    {/* Title - Stacked for mobile */}
                    <h1 className="text-3xl sm:text-4xl flex flex-col font-serif text-white text-center leading-tight mb-8">
                        <span className="mb-2">Prestige isn't built</span>
                        <span className="mb-2">in marble,</span>
                        <span>but in meaning.</span>
                    </h1>

                    {/* Decorative Element - Optional */}
                    <div className="w-16 h-1 bg-[#0a352d] mb-8"></div>

                    {/* CTA Button */}
                    <div className="flex justify-center w-full">
                        <a
                            href="#"
                            className="inline-block rounded-full bg-[#0a352d] px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white hover:text-[#0a352d] transition-all duration-300 text-center min-w-[200px] shadow-lg"
                        >
                            ONLINE VISIT
                        </a>
                    </div>
                </div>
            </section>

            {/* Alternative Mobile Version with Inline Video (use this if you prefer video not as background) */}
            <section className="relative flex lg:hidden w-full flex-col bg-gray-800 overflow-hidden py-12 px-4 hidden">
                {/* Uncomment this section and remove the above mobile section if you prefer inline video */}

                {/* Video at the top for mobile */}
                <div className="relative z-20 w-full mb-8">
                    <video
                        src="/assets/videos/video1.mp4"
                        className="w-full h-auto rounded-lg shadow-2xl"
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        aria-label="Butterfly video"
                    />
                </div>

                {/* Text Content */}
                <div className="relative z-20 container mx-auto flex flex-col items-center">
                    <h1 className="text-3xl sm:text-4xl flex flex-col font-serif text-white text-center leading-tight mb-6">
                        <span className="mb-2">Prestige isn't built</span>
                        <span className="mb-2">in marble,</span>
                        <span>but in meaning.</span>
                    </h1>

                    <div className="flex justify-center w-full">
                        <a
                            href="#"
                            className="inline-block rounded-full bg-[#0a352d] px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white hover:text-[#0a352d] transition-all duration-300 text-center min-w-[200px]"
                        >
                            ONLINE VISIT
                        </a>
                    </div>
                </div>
            </section>
            {/* Desktop Version (visible on lg and above) */}
            <section className="section2 relative lg:flex w-full flex-row items-center justify-center gap-8 py-16 px-6 bg-gray-800 overflow-hidden">

                {/* Right Column */}
                <div className="relative z-20 flex flex-col gap-5 w-1/2 ">
                    <video
                        src="/assets/videos/video1.mp4"
                        width={900}
                        height={700}
                        className="rounded-lg object-cover"
                        controls autoPlay muted loop
                        aria-label="Butterfly video showing a monarch butterfly in flight"
                    />
                </div>
                {/* Left Column */}
                <div className="mx-10 relative z-20 flex flex-col w-1/2 items-center text-left gap-6">
                    <h1 className="text-[clamp(1.5rem,3vw,3rem)] flex flex-col font-serif w-2/3 text-center text-black leading-snug">
                        <span>Prestige isn’t built</span>
                        <span>in marble,</span>
                        <span>but in meaning.</span>
                    </h1>


                    <div className="flex justify-center w-full">
                        <a
                            href="#"
                            className="inline-block rounded-full bg-[#0a352d] mt-6 px-6 py-3 border border-white text-white font-semibold hover:bg-gray-700 transition-colors duration-300"
                        >
                            ONLINE VISIT
                        </a>
                    </div>
                </div>
            </section>

       

        </>
    );
}