import { useState } from "react";

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

type Props = {
  confirmedLots: LotWithTerm[];
  beneficiaries: Beneficiary[];
  paymentSchedule: PaymentSchedule | null;
  paymentTerms: PaymentTerm[];
  onConfirm: () => void;
  onClose: () => void;
};

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

export default function ReviewAndSign({
  confirmedLots,
  beneficiaries,
  paymentSchedule,
  paymentTerms,
  onConfirm,
  onClose,
}: Props) {
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function termById(id: string) {
    return paymentTerms.find((t) => t.id === id);
  }

  function handleSubmit() {
    if (!confirmed) return;
    setSubmitted(true);
    onConfirm();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
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
                <p className="text-[0.8rem] text-[#9a9a9a] italic">No lots selected.</p>
              ) : (
                confirmedLots.map((lot) => {
                  const term = termById(lot.term_id);
                  return (
                    <div
                      key={lot.lot_available}
                      className="flex items-center justify-between px-3 py-2.5 bg-[#f9f9f7] border border-[#e8e3da] rounded-[8px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#b28648] flex-shrink-0" />
                        <span className="text-[0.85rem] font-medium text-[#060503]">
                          {lot.lot_available}
                        </span>
                        <span className="text-[0.65rem] uppercase tracking-[0.8px] bg-[#f0e8d4] text-[#a08c5a] rounded-[4px] px-[0.32rem] py-[0.1rem]">
                          {lot.lottype_name}
                        </span>
                      </div>
                      {term && (
                        <span className="text-[0.75rem] text-[#6b6b6b]">
                          {term.label} · {term.sublabel}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#e8e3da]" />

          {/* ── Beneficiaries */}
          <div>
            <SectionLabel>Beneficiaries</SectionLabel>
            <div className="flex flex-col gap-2">
              {beneficiaries.length === 0 ? (
                <p className="text-[0.8rem] text-[#9a9a9a] italic">No beneficiaries added.</p>
              ) : (
                beneficiaries.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 bg-[#f9f9f7] border border-[#e8e3da] rounded-[8px]"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#f0e8d4] flex items-center justify-center text-[0.7rem] font-semibold text-[#a08c5a] flex-shrink-0">
                      {b.firstName?.[0] ?? "?"}{b.lastName?.[0] ?? ""}
                    </div>
                    <div>
                      <p className="text-[0.85rem] font-medium text-[#060503] leading-tight">
                        {[b.firstName, b.middleName, b.lastName].filter(Boolean).join(" ") || "—"}
                      </p>
                      <p className="text-[0.7rem] text-[#9a9a9a]">Beneficiary {i + 1}</p>
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
                <span className="text-[0.8rem] text-[#6b6b6b]">Payment due every</span>
                <span className="text-[0.85rem] font-medium text-[#060503]">
                  {ordinal(paymentSchedule.paymentDay)} of each month
                </span>
              </div>
            ) : (
              <p className="text-[0.8rem] text-[#9a9a9a] italic">No payment schedule set.</p>
            )}
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
              I confirm that all the information above is accurate and I agree to
              proceed with the purchase agreement under the stated terms.
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
