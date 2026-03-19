"use client";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Step1 from "./DefaultStep";
import Step2 from "./VerifyOtp";
import Step3 from "./AdditionalInformation";
import Step4 from "./AddressInformation";
import Step5 from "./UploadGovernmentID";
import Step6 from "./EmailPassword";

export default function CustomerReg() {
  const [step, setStep] = useState<number>(() => {
    return Number(sessionStorage.getItem("step")) || 1;
  });

  // save step to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("step", step.toString());
  }, [step]);

  const nextStep = () => setStep((prev) => prev + 1);
  const backStep = () => setStep((prev) => prev - 1);

  return (
    <div className="w-full max-w-xl px-6 py-10 forms">
      <button
        onClick={() => (window.location.href = "/")}
        className="absolute top-4 right-4 bg-accent text-white px-4 py-3 rounded-full shadow hover:bg-green-700 transition flex items-center justify-center"
      >
        <ChevronLeft className="w-7 h-7 text-white" />
      </button>

      <img
        src="/assets/images/logo-hero.png"
        alt="Logo"
        className="w-[50%] h-auto mb-4 justify-self-center"
      />

      <div className="flex h-[85vh] w-full flex-col rounded-2xl shadow-xl bgSecondary forms">
        <div className="border-b px-8 pb-4 pt-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Buyer Registration
          </h2>
          <p className="text-sm text-gray-500">Complete your registration</p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
          
          {step === 1 && <Step1 nextStep={nextStep} />}
          
          {step === 2 && (
            <Step2 nextStep={nextStep} backStep={backStep} />
          )}
          {step === 3 && (
            <Step3 nextStep={nextStep} />
          )}
          {step === 4 && (
            <Step4 nextStep={nextStep} backStep={backStep} />
          )}
          {step === 5 && (
            <Step5 nextStep={nextStep} backStep={backStep} />
          )}
          {step === 6 && (
            <Step5 nextStep={nextStep} backStep={backStep} />
          )}

        </div>
      </div>
    </div>
  );
}