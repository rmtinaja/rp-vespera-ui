"use client";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Step1 from "./DefaultStep";
import Step2 from "./VerifyOtp";
import Step3 from "./AdditionalInformation";
import Step4 from "./AddressInformation";
import Step5 from "./UploadGovernmentID";
import Step6 from "./EmailPassword";
import Step7 from "./ReviewDetails";

export default function CustomerReg() {
  const [otpTimer, setOtpTimer] = useState(0);

  const [step, setStep] = useState<number | null>(null); // initially null
  const [hydrated, setHydrated] = useState(false); // track client hydration

  useEffect(() => {
    const savedStep = localStorage.getItem("step");
    setStep(savedStep ? Number(savedStep) : 1);
    setHydrated(true); // now it's safe to render
  }, []);
  useEffect(() => {
    if (step !== null) {
      localStorage.setItem("step", String(step));
    }
  }, [step]);

  const nextStep = () => {
    if (step !== null) setStep(step + 1);
  };

  const backStep = () => {
    if (step !== null) setStep(step - 1);
  };

  // Don't render anything until hydration to avoid mismatch
  if (!hydrated || step === null) return null;

  return (
    <>
      <div className="w-full max-w-xl px-6 py-10 forms lg:block hidden">
        <button
          onClick={() => {
            // 🔥 clear all stored data
            localStorage.clear();
            sessionStorage.clear();

            // (optional) clear auth token too
            document.cookie = "token=; Max-Age=0; path=/";

            // redirect
            window.location.href = "/";
          }}
          className="absolute top-4 right-4 bgAccent px-4 py-3 rounded-full shadow hover:bg-green-700 transition flex items-center justify-center"
        >
          <ChevronLeft className="w-7 h-7 text-white" />
        </button>
        <img
          src="/assets/images/logo-hero.png"
          alt="Logo"
          className="w-[50%] h-auto mb-4 justify-self-center"
        />

        <div className="flex h-[80vh] w-full flex-col rounded-2xl shadow-xl bgSecondary forms">
          <div className="border-b px-8 pb-4 pt-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Buyer Registration
            </h2>
            <p className="text-sm text-gray-500">Complete your registration</p>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
            {step === 1 && (
              <Step1 nextStep={nextStep} setOtpTimer={setOtpTimer} />
            )}
            {step === 2 && (
              <Step2
                nextStep={nextStep}
                backStep={backStep}
                otpTimer={otpTimer}
                setOtpTimer={setOtpTimer}
              />
            )}
            {step === 3 && <Step3 nextStep={nextStep} />}
            {step === 4 && <Step4 nextStep={nextStep} backStep={backStep} />}
            {step === 5 && <Step5 nextStep={nextStep} backStep={backStep} />}
            {step === 6 && <Step6 nextStep={nextStep} backStep={backStep} />}
            {step === 7 && <Step7 backStep={backStep} />}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[800px] px-4 sm:px-6 md:px-8 py-8 sm:py-10 mx-auto lg:hidden">
        <button
          onClick={() => {
            // 🔥 clear all stored data
            localStorage.clear();
            sessionStorage.clear();

            // (optional) clear auth token too
            document.cookie = "token=; Max-Age=0; path=/";

            // redirect
            window.location.href = "/";
          }}
          className="absolute top-4 right-4 bgAccent px-4 py-3 rounded-full shadow hover:bg-green-700 transition flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* Logo */}
        <img
          src="/assets/images/logo-hero.png"
          alt="Logo"
          className="w-36 sm:w-44 md:w-48 mx-auto h-auto mb-6"
        />

        {/* Card Container */}
        <div className="flex flex-col h-[85vh] bg-[#faf8f4] rounded-2xl px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="border-b border-[#d6d3d1] pb-4 mb-4 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-medium text-[#060503]">
              Buyer Registration
            </h2>
            <p className="text-sm sm:text-base text-[#6b6b6b] mt-1">
              Complete your registration
            </p>
            <p className="text-sm text-[#6b6b6b] mt-1">Step {step} of 7</p>
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto max-h-[70vh] sm:max-h-[75vh] px-2 sm:px-4 py-4 sm:py-6 space-y-4">
            {step === 1 && (
              <Step1 nextStep={nextStep} setOtpTimer={setOtpTimer} />
            )}
            {step === 2 && (
              <Step2
                nextStep={nextStep}
                backStep={backStep}
                otpTimer={otpTimer}
                setOtpTimer={setOtpTimer}
              />
            )}
            {step === 3 && <Step3 nextStep={nextStep} />}
            {step === 4 && <Step4 nextStep={nextStep} backStep={backStep} />}
            {step === 5 && <Step5 nextStep={nextStep} backStep={backStep} />}
            {step === 6 && <Step6 nextStep={nextStep} backStep={backStep} />}
            {step === 7 && <Step7 backStep={backStep} />}
          </div>
        </div>
      </div>
    </>
  );
}
