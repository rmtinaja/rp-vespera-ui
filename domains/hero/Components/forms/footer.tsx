import Image from "next/image";
import { Phone, Facebook, MapPin, Trees } from "lucide-react";

export default function Footer() {
    return (
        <section className="footer w-full py-16 bg-gray-900 text-white">

            {/* Logo */}
            <div className="flex flex-col items-center gap-4">
                <Image
                    src="/assets/images/logo-hero.png"
                    alt="Hero Image"
                    width={300}
                    height={300}
                    className="w-[clamp(150px,30vw,300px)] h-auto"
                />
            </div>

            {/* Heading */}
            <h1 className="flex flex-col mt-5 mx-10 px-6">
                <span className="text-2xl font-semibold">
                    Plan with peace of mind.
                </span>
                <span className="mt-2 text-gray-300">
                    Visit us to experience the tranquility firsthand. Let’s begin the conversation.
                </span>
            </h1>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 mt-5 w-[85%] mx-auto">

                {/* Phone */}
                <div className="py-4 flex items-start gap-3 border-b-2">
                    <Phone size={20} className="mt-1 text-white" />
                    <span>0922 588 3675</span>
                </div>

                {/* Facebook */}
                <div className="flex items-start gap-3 py-4 border-b-2">
                    <Facebook size={20} className="mt-1 text-white" />
                    <span>/RenaissanceParkAndChapels</span>
                </div>

                {/* Office Location */}
                <div className="py-4 flex items-start gap-3 border-b-2">
                    <MapPin size={20} className="mt-1 text-white" />
                    <div>
                        <span>Office is located at Judge Alba-</span>
                        <br />
                        <span>Arellano St, Koronadal City</span>
                    </div>
                </div>

                {/* Park Location */}
                <div className="py-4 flex items-start gap-3 border-b-2">
                    <Trees size={20} className="mt-1 text-white" />
                    <div>
                        <span>The Park is located at Purok 2,</span>
                        <br />
                        <span>San Filipe, Tantangan, South Cotabato</span>
                    </div>
                </div>

            </div>
            <div className="mt-10 text-center text-gray-500">
                <span><p>Copyright © 2026 Renaissance Park and Chapels. All rights reserved.</p></span>
            </div>
        </section>
    );
}