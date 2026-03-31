import "./scss/CustomerRegs.scss";
import "@/app/globals.scss";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Form / Image */}
      <div className="relative overflow-hidden w-full h-64 lg:h-auto lg:block hidden">
        <img
          src="/assets/images/learn_more_2_3.jpg"
          className="absolute inset-0 w-full h-full object-cover brightness-85 blur-[2px] scale-105"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <h1
            className="text-center text-white font-playfair
                       text-3xl sm:text-4xl lg:text-5xl
                       leading-snug drop-shadow-xl
                       animate-fade-up"
          >
            Let’s get you started. Complete your registration to access all
            features.
          </h1>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center bgPrimary p-6">
        {children}
      </div>
    </div>
  );
}