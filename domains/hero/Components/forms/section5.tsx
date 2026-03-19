"use client";
import Image from "next/image";
import { Carousel } from "primereact/carousel";


export default function Section5() {
    // Static image data
    const testimonials = [
        {
            image: "/assets/images/testi-1.png",
            alt: "Dagum Family Testimonial"
        },
        {
            image: "/assets/images/testi-2.png",
            alt: "Madrero Family Testimonial"
        },
        {
            image: "/assets/images/testi-3.png",
            alt: "Vice Mayor Cesar Dasilao Testimonial"
        },
    ];

    const responsiveOptions = [
        {
            breakpoint: "1024px",
            numVisible: 1,
            numScroll: 1,
        },
        {
            breakpoint: "768px",
            numVisible: 1,
            numScroll: 1,
        },
    ];

    const imageTemplate = (item : any) => {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="relative w-full max-w-md mx-auto rounded-lg shadow-2xl overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.alt}
                        className="w-full h-auto object-contain"
                        loading="lazy"
                    />
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Desktop Version (visible on lg and above) */}
            <section className="section1 relative desktop lg:flex w-full flex-row  gap-8  bg-gray-800 overflow-hidden">

                {/* 🔥 50% Background Overlay */}
                <div className="absolute inset-0 bg-[#dfd7cf]/70 z-10"></div>

                {/* Left Column */}
                <div className="mx-10 !justify-start z-20 flex flex-col w-2/3 text-left gap-6">
                    <h1 className="text-[clamp(1.5rem,3vw,3rem)] font-serif text-white leading-snug">
                        Voices of those who entrusted us with what
                        matters most — love, memory, and grace.
                    </h1>
                    <Carousel
                        value={testimonials}
                        numVisible={1}
                        numScroll={1}
                        responsiveOptions={responsiveOptions}
                        circular
                        autoplayInterval={3000}
                        itemTemplate={imageTemplate}
                        className="w-[50%] justify-center mx-auto"
                    />
                </div>

                {/* Right Column */}
                <div className="relative z-10 flex flex-col gap-5 w-[25%] bg-[#d2b894] h-full ">
                    <h1 className="h-full py-25 rotate-90 justify-end text-center text-[clamp(4rem,3vw,3rem)] text-white text-center mt-10 flex flex-col">
                        <span>VOICES OF</span>
                        <span>GRATITUDE</span>
                    </h1>

                </div>

            </section>

            {/* Mobile Version (visible below lg) */}
            <section className="relative flex mobile w-full flex-col bg-gray-800 overflow-hidden py-12 px-4">

                {/* Background Overlay */}
                <div className="absolute inset-0 bg-[#dfd7cf]/70 z-10"></div>

                {/* Content Container */}
                <div className="relative z-20 container mx-auto">
                    {/* Mobile Title for VOICES OF GRATITUDE */}
                    <div className="text-center mt-6">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-wider">
                            <span className="block">VOICES OF</span>
                            <span className="block text-[#d2b894]">GRATITUDE</span>
                        </h2>
                        <div className="w-24 h-1 bg-[#d2b894] mx-auto mt-4"></div>
                    </div>
                    {/* Title */}
                    <h1 className="mt-2 text-2xl sm:text-3xl font-serif text-white leading-snug text-center mb-8 max-w-2xl mx-auto">
                        Voices of those who entrusted us with what
                        matters most — love, memory, and grace.
                    </h1>

                    {/* Carousel */}
                    <div className="w-full max-w-md mx-auto mb-8">
                        <Carousel
                            value={testimonials}
                            numVisible={1}
                            numScroll={1}
                            responsiveOptions={responsiveOptions}
                            circular
                            autoplayInterval={3000}
                            itemTemplate={imageTemplate}
                            className="w-full"
                            showIndicators={true}
                            showNavigators={false}
                        />
                    </div>


                </div>
            </section>
        </>
    );
}