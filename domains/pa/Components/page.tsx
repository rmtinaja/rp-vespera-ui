"use client";

import { useState, useEffect } from "react";
import SelectLotDialog from "../Components/dialogs/SelectLotDialog";
import Beneficiaries from "./forms/Beneficiaries";
import PaymentSchedule from "./forms/PaymentSchedule";
import ReviewAndSign from "./forms/ReviewAndSign";
import { PurchaseAgreementService } from "../Services/pa.service";

type LotWithTerm = {
  lottype_name: string;
  lot_available: string;
  term_id: string;
};

type Beneficiary = {
  firstName: string;
  middleName: string;
  lastName: string;
};

type PaymentTerm = {
  id: string;
  label: string;
  sublabel: string;
  months: number;
};

type PaymentScheduleType = {
  scheduleId: string;
  paymentDay: number;
};

const SESSION_KEY_LOTS = "confirmedLots";
const SESSION_KEY_BENEFICIARIES = "beneficiaries";
const SESSION_KEY_PAYMENT = "paymentSchedule";

export default function PurchaseAgreement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<number | null>(null);

  const [confirmedLots, setConfirmedLots] = useState<LotWithTerm[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([]);
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentScheduleType | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  // ── Load session data
  useEffect(() => {
    const savedLots = sessionStorage.getItem(SESSION_KEY_LOTS);
    if (savedLots) setConfirmedLots(JSON.parse(savedLots));

    const savedBeneficiaries = sessionStorage.getItem(SESSION_KEY_BENEFICIARIES);
    if (savedBeneficiaries) setBeneficiaries(JSON.parse(savedBeneficiaries));

    const savedPayment = sessionStorage.getItem(SESSION_KEY_PAYMENT);
    if (savedPayment) setPaymentSchedule(JSON.parse(savedPayment));
  }, []);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY_LOTS, JSON.stringify(confirmedLots));
  }, [confirmedLots]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY_BENEFICIARIES, JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  useEffect(() => {
    if (paymentSchedule) {
      sessionStorage.setItem(SESSION_KEY_PAYMENT, JSON.stringify(paymentSchedule));
    }
  }, [paymentSchedule]);

  // ── Fetch payment terms
  useEffect(() => {
    async function fetchTerms() {
      setLoading(true);
      try {
        const termsRes = await PurchaseAgreementService.getAmortTerms();
        const termsMapped: PaymentTerm[] = termsRes.data.amortterm.map((t) => ({
          id: t.mp_i_amort_term.toString(),
          label: t.description,
          sublabel: `${t.num_months} ${t.num_months > 1 ? "Months" : "Month"}`,
          months: t.num_months,
        }));
        setPaymentTerms(termsMapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTerms();
  }, []);

  function termById(id: string) {
    return paymentTerms.find((t) => t.id === id);
  }

  function openDialog(stepNum: number) {
    setCurrentStep(stepNum);
    setActiveDialog(stepNum);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setActiveDialog(null);
  }

  function ordinal(n: number) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  const allStepsDone =
    confirmedLots.length > 0 &&
    beneficiaries.length > 0 &&
    paymentSchedule !== null;

  const steps = [
    {
      num: 1,
      label: "Select Lots",
      done: confirmedLots.length > 0,
      canClick: !submitted,
      summary:
        confirmedLots.length > 0
          ? `${confirmedLots.length} lot${confirmedLots.length !== 1 ? "s" : ""} selected`
          : "No lots selected yet",
    },
    {
      num: 2,
      label: "Beneficiary Information",
      done: beneficiaries.length === 2,
      canClick: confirmedLots.length > 0 && !submitted,
      summary:
        beneficiaries.length > 0
          ? `${beneficiaries.length} beneficiar${beneficiaries.length !== 1 ? "ies" : "y"} added`
          : "No beneficiaries added yet",
    },
    {
      num: 3,
      label: "Payment Schedule",
      done: paymentSchedule !== null,
      canClick: confirmedLots.length > 0 && beneficiaries.length > 0 && !submitted,
      summary: paymentSchedule
        ? `Payment on ${ordinal(paymentSchedule.paymentDay)} of each month`
        : "Not yet configured",
    },
    {
      num: 4,
      label: "Review & Sign",
      done: submitted,
      canClick: allStepsDone && !submitted,
      summary: submitted
        ? "Agreement submitted"
        : allStepsDone
          ? "Ready to review"
          : "Complete previous steps first",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-8 font-sans">
      <div className="bg-white rounded-xl border border-[#d6d3d1] p-10 max-w-[720px] w-full shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        <h1 className="font-serif text-[2rem] font-medium text-[#060503] mb-2">
          Purchase Agreement
        </h1>
        <p className="text-[0.875rem] text-[#6b6b6b] italic mb-6">
          Select your lot and enter beneficiary information before finalizing.
        </p>

        {/* Submitted banner */}
        {submitted && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-[#f0faf4] border border-[#a8d5b5] rounded-[10px]">
            <div className="w-6 h-6 rounded-full bg-[#2e7d52] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[0.85rem] text-[#2e7d52] font-medium">
              Agreement submitted successfully.
            </span>
          </div>
        )}

        {/* Step Buttons */}
        <div className="flex flex-col gap-3">
          {steps.map((s) => (
            <button
              key={s.num}
              type="button"
              disabled={!s.canClick || loading}
              onClick={() => s.canClick && !loading && openDialog(s.num)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-[1.5px] text-left transition-all
                ${s.done
                  ? "border-[#b28648] bg-[#fef8f2] hover:bg-[#fdf3e7]"
                  : currentStep === s.num
                    ? "border-[#060503] bg-[#f5f1eb] hover:bg-[#ede9e2]"
                    : s.canClick
                      ? "border-[#d6d3d1] bg-white hover:bg-[#f5f5f3] hover:border-[#060503]"
                      : "border-[#d6d3d1] bg-[#f9f9f9] opacity-50 cursor-not-allowed"
                }`}
            >
              <div
                className={`w-9 h-9 flex-shrink-0 flex items-center justify-center font-mono text-sm font-semibold rounded-full border-[1.5px] transition-colors
                  ${currentStep === s.num && s.canClick
                    ? "bg-[#060503] border-[#060503] text-[#b28648]"
                    : s.done
                      ? "bg-[#b28648] border-[#b28648] text-white"
                      : "bg-[#f7f7f7] border-[#d6d3d1] text-[#6b6b6b]"
                  }`}
              >
                {s.done ? "✔" : `0${s.num}`}
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className={`block text-[0.875rem] font-sans font-semibold
                    ${currentStep === s.num
                      ? "text-[#060503]"
                      : s.done
                        ? "text-[#b28648]"
                        : "text-[#6b6b6b]"
                    }`}
                >
                  {s.label}
                </span>
                <span className="block text-[0.75rem] text-[#9a9a9a] mt-[1px]">
                  {s.summary}
                </span>
              </div>
              {s.canClick && (
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  width="16"
                  height="16"
                  className={`flex-shrink-0 transition-colors ${s.done ? "text-[#b28648]" : "text-[#9a9a9a]"}`}
                >
                  <path
                    d="M7 5l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Dialog — Step 1: Select Lots */}
      {dialogOpen && activeDialog === 1 && !loading && (
        <SelectLotDialog
          initial={confirmedLots}
          paymentTerms={paymentTerms}
          onConfirm={(lots) => {
            setConfirmedLots(lots);
            closeDialog();
          }}
          onClose={closeDialog}
        />
      )}

      {/* Dialog — Step 2: Beneficiaries */}
      {dialogOpen && activeDialog === 2 && (
        <Beneficiaries
          initialBeneficiaries={beneficiaries}
          setDialogOpen={setDialogOpen}
          setActiveDialog={setActiveDialog}
          onSave={(updated) => {
            setBeneficiaries(updated);
            closeDialog();
          }}
        />
      )}

      {/* Dialog — Step 3: Payment Schedule */}
      {dialogOpen && activeDialog === 3 && (
        <PaymentSchedule
          initialSchedule={paymentSchedule}
          paymentTerms={paymentTerms}
          confirmedLots={confirmedLots}
          onSave={(schedule) => {
            setPaymentSchedule(schedule);
            closeDialog();
          }}
          onClose={closeDialog}
        />
      )}

      {/* Dialog — Step 4: Review & Sign */}
      {dialogOpen && activeDialog === 4 && (
        <ReviewAndSign
          confirmedLots={confirmedLots}
          beneficiaries={beneficiaries}
          paymentSchedule={paymentSchedule}
          paymentTerms={paymentTerms}
          onConfirm={() => {
            setSubmitted(true);
            closeDialog();
          }}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}