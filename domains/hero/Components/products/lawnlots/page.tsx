"use client";

import Link from "next/link";
import MarbleBlock from "../../dialog/marble-blocks";

export default function LawnLots() {
    return (
        <section className="h-screen w-full overflow-hidden flex">
            <div className="flex w-full h-full">

                {/* LEFT COLUMN */}
                <div className="w-1/2 h-full flex justify-center items-center">
                    <div className="max-h-[90%] flex items-center">
                        <MarbleBlock />
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="w-1/2 h-full flex flex-col justify-center px-10">
                    <h1 className="text-6xl font-bold m-0">
                        LAWN LOT
                    </h1>

                    <p className="text-lg my-6 leading-relaxed">
                        Sophisticated space for
                        <br />
                        sacred memory.
                    </p>

                    <div className="flex flex-col gap-4 lawnlots-buttons ">
                        <Link href="lawnlots/regular-lawn" className="lot-btn  border border-black px-5 py-3 w-fit transition duration-300 hover:bg-black hover:text-white">
                            REGULAR LAWN
                        </Link>
                        <Link href="lawnlots/premium-lawn" className="lot-btn  border border-black px-5 py-3 w-fit transition duration-300 hover:bg-black hover:text-white">
                            PREMIUM LAWN
                        </Link>
                        <Link href="lawnlots/super-premium-lawn" className="lot-btn  border border-black px-5 py-3 w-fit transition duration-300 hover:bg-black hover:text-white">
                            SUPER PREMIUM LAWN
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}