import { useEffect, useRef, useState } from "react";
import { PurchaseAgreementService } from "../../Services/pa.service";
import Loading from "../dialogs/Loading";
import {
  toastError,
  toastSuccess,
} from "@/sharedComponents/services/ToastContext";
import { Check } from "lucide-react";
import { refresh } from "next/cache";

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

type PaymentSchedule = {
  scheduleId: string;
  paymentDay: number;
};

type PaymentTerm = {
  id: string;
  label: string;
  sublabel: string;
  months: number;
};

type PricingData = {
  lot: {
    lotId: number;
    lottype: string;
    pcfAccount: number;
    amortType: string;
  };
  spotcash: {
    amtSales: number;
    amtPcf: number;
    amtVat: number;
    amtSpotcash: number;
  };
  amort: {
    contractPrice: number;
    amtAmortSales: number;
    amtAmortPcf: number;
    amtAmortVat: number;
    amtAmortPrice: number;
  };
  contract: {
    numMonths: number;
    amtContract: number;
    totalContractPrice: number;
  };
};

type Props = {
  confirmedLots: LotWithTerm[];
  beneficiaries: Beneficiary[];
  paymentSchedule: PaymentSchedule | null;
  paymentTerms: PaymentTerm[];
  onConfirm: (params: SavePurchaseAgreementParams) => void;
  onClose: () => void;
};

interface SavePurchaseAgreementParams {
  adorg: string;
  mp_i_owner: number;
  first_beneficiary?: string | null;
  second_beneficiary?: string | null;
  mp_i_lot: number;
  amort_term: number;
  cnt_months_to_pay: number;
  amt_sales: number;
  amt_spotcash?: number | null;
  amt_spotcash_vat: number;
  amt_spotcash_pcf?: number | null;
  amt_amort?: number | null;
  amt_amort_sales?: number | null;
  amt_amort_vat?: number | null;
  amt_amort_pcf?: number | null;
  amt_contract: number;
  date_sched_payment: string;
  signature: string;
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.65rem] tracking-[1.2px] uppercase text-[#9a9a9a] font-semibold mb-2">
      {children}
    </p>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function ReviewAndSign({
  confirmedLots,
  beneficiaries,
  paymentSchedule,
  paymentTerms,
  onConfirm,
  onClose,
}: Props) {
  const [checking, setChecking] = useState(false);
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [isDrawingDisabled, setIsDrawingDisabled] = useState(false);
  function termById(id: string) {
    return paymentTerms.find((t) => t.id === id);
  }
  function startDrawing(e: any) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(getX(e), getY(e));
    setDrawing(true);
  }

  function draw(e: any) {
    if (!drawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(getX(e), getY(e));
    ctx.stroke();
  }

  function stopDrawing() {
    setDrawing(false);
  }

  function getX(e: any) {
    const canvas = canvasRef.current!;
    return (
      (e.touches ? e.touches[0].clientX : e.clientX) -
      canvas.getBoundingClientRect().left
    );
  }

  function getY(e: any) {
    const canvas = canvasRef.current!;
    return (
      (e.touches ? e.touches[0].clientY : e.clientY) -
      canvas.getBoundingClientRect().top
    );
  }

  function handleSaveSignature() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");

    setSignature(dataUrl);
    sessionStorage.setItem("signature", dataUrl);

    setIsSaved(true);
    setIsDrawingDisabled(true);
    toastSuccess("Signature saved!");
  }
  async function handleSubmit() {
    // setChecking(true);
    if (!confirmed) return;

    const mpIOwnerRaw = localStorage.getItem("user");
    const confirmedLotsRaw = sessionStorage.getItem("confirmedLots");
    const pricingRaw = sessionStorage.getItem("pricing");
    const beneficiariesRaw = sessionStorage.getItem("beneficiaries");
    const paymentScheduleRaw = sessionStorage.getItem("paymentSchedule");
    const signatureRaw = sessionStorage.getItem("signature");

    if (
      !confirmedLotsRaw ||
      !pricingRaw ||
      !mpIOwnerRaw ||
      !beneficiariesRaw ||
      !paymentScheduleRaw ||
      !signatureRaw
    ) {
      toastError("Missing sessionStorage data");
      return;
    }

    const confirmedLots = JSON.parse(confirmedLotsRaw);
    const pricing = JSON.parse(pricingRaw);
    const mpIOwner = JSON.parse(mpIOwnerRaw);
    const beneficiaries = JSON.parse(beneficiariesRaw);
    const paymentSchedule = JSON.parse(paymentScheduleRaw);
    const signature = signatureRaw;

    const base64Only = signature.split("base64,")[1];

    const selectedLot = confirmedLots?.[0];

    if (!selectedLot) {
      toastError("No confirmed lot found");
      return;
    }
    const first_beneficiary = beneficiaries?.[0]
      ? `${beneficiaries[0].firstName} ${beneficiaries[0].middleName ? beneficiaries[0].middleName + " " : ""}${beneficiaries[0].lastName}`
      : null;

    const second_beneficiary = beneficiaries?.[1]
      ? `${beneficiaries[1].firstName} ${beneficiaries[1].middleName ? beneficiaries[1].middleName + " " : ""}${beneficiaries[1].lastName}`
      : null;

    const params: SavePurchaseAgreementParams = {
      adorg: "162011",
      mp_i_owner: mpIOwner.mp_i_owner_id,
      first_beneficiary: first_beneficiary,
      second_beneficiary: second_beneficiary,
      mp_i_lot: Number(selectedLot.lot_id),

      amort_term: Number(selectedLot.term_id),
      cnt_months_to_pay: Number(pricing.contract.numMonths),

      amt_sales: Number(pricing.spotcash.amtSales),
      amt_spotcash: pricing.spotcash.amtSpotcash ?? null,
      amt_spotcash_vat: Number(pricing.spotcash.amtVat),
      amt_spotcash_pcf: Number(pricing.spotcash.amtPcf),

      amt_amort: pricing.amort.amtAmortPrice ?? null,
      amt_amort_sales: Number(pricing.amort.amtAmortSales),
      amt_amort_vat: Number(pricing.amort.amtAmortVat),
      amt_amort_pcf: Number(pricing.amort.amtAmortPcf),

      amt_contract: Number(pricing.contract.amtContract),
      date_sched_payment: paymentSchedule.fullDate,
      signature: base64Only,
    };

    setSubmitted(true);
    try {
      const res = await PurchaseAgreementService.savePurchaseAgreement(params);
      toastSuccess("Purchase agreement saved successfully");
      setTimeout(() => {
        sessionStorage.clear();
        window.location.reload();
      }, 300);
    } catch (err: any) {
      if (err.response) {
        toastError(
          "Server responded with:",
          err.response.status,
          err.response.data,
        );
      } else {
        toastError("Network or Axios error:", err.message);
      }
    } finally {
      setChecking(false);
    }
    onConfirm(params);
  }

  useEffect(() => {
    const stored = sessionStorage.getItem("pricing");
    if (stored) {
      setPricing(JSON.parse(stored));
    }
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
  }, []);
  useEffect(() => {
    const savedSignature = sessionStorage.getItem("signature");

    if (!savedSignature) return;

    setSignature(savedSignature);
    setIsSaved(true);
    setIsDrawingDisabled(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = savedSignature;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, []);
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      {checking && <Loading text="Saving purchase agreement.Please Wait!..." />}
      <div className="bg-white rounded-xl border border-[#d6d3d1] shadow-xl w-full max-w-[520px] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e3da] bg-[#f5f1eb] flex-shrink-0">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#060503]">
              Review & Sign
            </h2>
            <p className="text-[0.75rem] text-[#9a9a9a] mt-[1px]">
              Confirm all details before submitting
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9a9a9a] hover:text-[#060503] text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">
          {/* ── Lots */}
          <div>
            <SectionLabel>Selected Lots</SectionLabel>
            <div className="flex flex-col gap-2">
              {confirmedLots.length === 0 ? (
                <p className="text-[0.8rem] text-[#9a9a9a] italic">
                  No lots selected.
                </p>
              ) : (
                confirmedLots.map((lot) => {
                  const term = termById(lot.term_id);
                  return (
                    <div
                      key={lot.lot_available}
                      className="flex items-center justify-between px-3 py-2.5 bg-[#f9f9f7] border border-[#e8e3da] rounded-[8px]"
                    >
                      <div className="flex gap-2 flex-col w-full">
                        <div className="flex items-center gap-2 justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#b28648] flex-shrink-0" />
                            <span className="text-[0.85rem] font-medium text-[#060503]">
                              {lot.lot_available}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[0.65rem] uppercase tracking-[0.8px] bg-[#f0e8d4] text-[#a08c5a] rounded-[4px] px-[0.32rem] py-[0.1rem]">
                              {lot.lottype_name}
                            </span>
                          </div>
                        </div>
                        {term && (
                          <span className="text-[0.75rem] text-[#6b6b6b]">
                            {term.label} · {term.sublabel}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#e8e3da]" />

          {/* ── Pricing Summary */}
          {/* ── Pricing Summary */}
          {pricing && (
            <>
              <div>
                <SectionLabel>Pricing Summary</SectionLabel>

                <div className="bg-[#f9f9f7] border border-[#e8e3da] rounded-[8px] overflow-hidden">
                  {pricing.lot.amortType === "Spot Cash" ? (
                    /* Spot Cash */
                    <div className="px-3 py-2 border-b border-[#e8e3da]">
                      <p className="text-[0.7rem] text-[#9a9a9a] uppercase tracking-wide mb-1">
                        Spot Cash
                      </p>

                      <div className="flex justify-between items-center text-[0.8rem]">
                        <span className="text-[#6b6b6b]">Total Spot Cash:</span>
                        <span className="font-semibold text-[#060503]">
                          {formatCurrency(pricing.spotcash.amtSpotcash)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Amortization */
                    <div className="px-3 py-2">
                      <p className="text-[0.7rem] text-[#9a9a9a] uppercase tracking-wide mb-1">
                        Amortization ({pricing.lot.amortType})
                      </p>

                      <div className="flex justify-between items-center text-[0.8rem]">
                        <span className="text-[#6b6b6b]">
                          Monthly Amortization:
                        </span>
                        <span className="font-semibold text-[#060503]">
                          {formatCurrency(pricing.amort.amtAmortPrice)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#e8e3da]" />
            </>
          )}

          {/* ── Beneficiaries */}
          <div>
            <SectionLabel>Beneficiaries</SectionLabel>
            <div className="flex flex-col gap-2">
              {beneficiaries.length === 0 ? (
                <p className="text-[0.8rem] text-[#9a9a9a] italic">
                  No beneficiaries added.
                </p>
              ) : (
                beneficiaries.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 bg-[#f9f9f7] border border-[#e8e3da] rounded-[8px]"
                  >
                    <div>
                      <p className="text-[0.85rem] font-medium text-[#060503] leading-tight">
                        {[b.firstName, b.middleName, b.lastName]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </p>
                      <p className="text-[0.7rem] text-[#9a9a9a]">
                        Beneficiary {i + 1}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#e8e3da]" />

          {/* ── Payment Schedule */}
          <div>
            <SectionLabel>Payment Schedule</SectionLabel>
            {paymentSchedule ? (
              <div className="flex items-center justify-between px-3 py-2.5 bg-[#f9f9f7] border border-[#e8e3da] rounded-[8px]">
                <span className="text-[0.8rem] text-[#6b6b6b]">
                  Payment due every
                </span>
                <span className="text-[0.85rem] font-medium text-[#060503]">
                  {ordinal(paymentSchedule.paymentDay)} of each month
                </span>
              </div>
            ) : (
              <p className="text-[0.8rem] text-[#9a9a9a] italic">
                No payment schedule set.
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[#e8e3da]" />

          {/* ── E-Signature */}
          <div>
            <SectionLabel>E-Signature</SectionLabel>

            <div className="bg-[#f9f9f7] border border-[#e8e3da] rounded-[8px] p-3 flex flex-col gap-2">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className={`w-full bg-white border border-dashed border-[#d6d3d1] rounded-md ${
                  isDrawingDisabled ? "pointer-events-none opacity-60" : ""
                }`}
                onMouseDown={(e) => !isDrawingDisabled && startDrawing(e)}
                onMouseMove={(e) => !isDrawingDisabled && draw(e)}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={(e) => !isDrawingDisabled && startDrawing(e)}
                onTouchMove={(e) => !isDrawingDisabled && draw(e)}
                onTouchEnd={stopDrawing}
              />

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;

                    const ctx = canvas.getContext("2d");
                    if (!ctx) return;

                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    setSignature(null);
                    setIsSaved(false);
                    setIsDrawingDisabled(false);

                    sessionStorage.removeItem("signature");
                  }}
                  className="text-xs text-[#9a9a9a] hover:text-[#060503]"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={handleSaveSignature}
                  disabled={isSaved}
                  className={`text-xs font-medium flex items-center gap-1 transition ${
                    isSaved
                      ? "text-green-600 cursor-not-allowed"
                      : "text-[#b28648] hover:opacity-80"
                  }`}
                >
                  {isSaved ? (
                    <>
                      Saved <Check size={16} />
                    </>
                  ) : (
                    <>
                      Save Signature <Check size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#e8e3da]" />

          {/* ── Confirmation checkbox */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-[2px] w-4 h-4 accent-[#060503] cursor-pointer flex-shrink-0"
            />
            <span className="text-[0.8rem] text-[#6b6b6b] leading-relaxed">
              I confirm that all the information above is accurate and I agree
              to proceed with the purchase agreement under the stated terms.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e8e3da] bg-[#f5f1eb] flex-shrink-0">
          <button
            className="px-5 py-2.5 rounded-lg border-[1.5px] border-[#d6d3d1] text-sm text-[#5a5040] hover:border-[#060503] hover:text-[#060503] transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={!confirmed || submitted}
            onClick={handleSubmit}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm tracking-[0.5px] transition-all ${
              confirmed && !submitted
                ? "bg-[#060503] text-[#b28648] hover:bg-[#1a1a1a] shadow-md cursor-pointer"
                : "bg-[#e8e3da] text-[#b0a898] cursor-not-allowed"
            }`}
          >
            {submitted ? "Submitted" : "Submit Agreement"}
            {!submitted && (
              <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
                <path
                  d="M4 10h12M12 6l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
