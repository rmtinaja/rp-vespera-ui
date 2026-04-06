'use client';

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import OTPConfirmation from "./Forms/OTPConfirmation";
import LSPayment from "./Forms/LSPayment";
import IntermentPayment from "./Forms/IntermentPayment";
import PaymentSelection from "./Forms/paymentSelection";
import CustomerInformation from "./Forms/CustomerInformation";
import ConfirmationPage from "./Forms/Confirmation";
import OthersPayment from "./Forms/OtherPayments";

export default function Form() {
  const toast = useRef<Toast>(null);

  const [currentForm, setCurrentForm] = useState<number>(0);
  const [paymentForm, setPaymentForm] = useState<string>("");

  // ✅ Restore session on reload
  useEffect(() => {
    const storedForm = sessionStorage.getItem("CurrentForm");
    const storedPayment = sessionStorage.getItem("PaymentOption");

    if (storedForm) {
      setCurrentForm(Number(storedForm));
    } else {
      sessionStorage.setItem("CurrentForm", "0");
    }

    if (storedPayment) {
      setPaymentForm(storedPayment);
    }
  }, []);

  // ✅ Centralized navigation
  const changeForm = (step: number, payment?: string) => {
    if (payment) {
      setPaymentForm(payment);
      sessionStorage.setItem("PaymentOption", payment);
    }

    setCurrentForm(step);
    sessionStorage.setItem("CurrentForm", step.toString());
  };

  return (
    <div className="w-full flex flex-row justify-center">
      <div className="lg:w-4/5 w-[90%] lg:p-10 p-5 bg-secondary-rp rounded-2xl">

        {/* STEP 0 */}
        {currentForm === 0 && (
          <CustomerInformation nextPage={() => changeForm(1)} />
        )}

        {/* STEP 1 */}
        {currentForm === 1 && (
          <OTPConfirmation
            nextPage={() => changeForm(2)}
            prevPage={() => changeForm(0)}
          />
        )}

        {/* STEP 2 */}
        {currentForm === 2 && (
          <PaymentSelection
            nextPage={(paymentType) => changeForm(3, paymentType)}
          />
        )}

        {/* STEP 3 - Dynamic Payment Forms */}
        {currentForm === 3 && paymentForm === "LSP" && (
          <LSPayment nextPage={() => changeForm(4)} />
        )}

        {currentForm === 3 && paymentForm === "IP" && (
          <IntermentPayment nextPage={() => changeForm(4)} />
        )}

        {currentForm === 3 && paymentForm === "Others" && (
          <OthersPayment nextPage={() => changeForm(4)} />
        )}
        {/* STEP 4 */}
        {currentForm === 4 && <ConfirmationPage />}

      </div>
    </div>
  );
}