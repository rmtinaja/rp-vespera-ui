"use client";

import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();

  const handleProceed = () => {
    router.push("/");
    sessionStorage.removeItem('CurrentForm');
    sessionStorage.removeItem('PaymentOption');
    sessionStorage.removeItem('verifiedCustomer');
  };

  return (
    <div className="flex flex-col items-center justify-around gap-7 text-3xl font-raleway text-center !font-bold">
      Thank you <br /> for your payment

      <button
        onClick={handleProceed}
        className="bg-accent-rp text-white w-full"
      >
        Proceed
      </button>
    </div>
  );
}