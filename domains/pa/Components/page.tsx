"use client";

import { useState, useEffect } from "react";
import SelectLotDialog from "../Components/dialogs/SelectLotDialog";
import { PurchaseAgreementService } from "../Services/pa.service";

type LotWithTerm = {
  lottype_name: string;
  lot_available: string;
  term_id: string;
};

export default function PurchaseAgreement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmedLots, setConfirmedLots] = useState<LotWithTerm[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<
    { id: string; label: string; sublabel: string; months: number }[]
  >([]);
  const [lotTypes, setLotTypes] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch dynamic data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [termsRes] = await Promise.all([
          PurchaseAgreementService.getAmortTerms(),
        ]);

        // ── Map amort terms
        const termsMapped = termsRes.data.amortterm.map((t) => ({
          id: t.mp_i_amort_term.toString(),
          label: t.description,
          sublabel: `${t.num_months} ${t.num_months > 1 ? "Months" : "Month"}`,
          months: t.num_months,
        }));
        setPaymentTerms(termsMapped);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function termById(id: string) {
    return paymentTerms.find((t) => t.id === id);
  }

  return (
    <>
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-8 font-sans">
        <div className="bg-white rounded-xl border border-[#d6d3d1] p-10 max-w-[720px] w-full shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <h1 className="font-serif text-[2rem] font-medium text-[#060503] mb-2">
            Purchase Agreement
          </h1>
          <p className="text-[0.875rem] text-[#6b6b6b] italic mb-6">
            Select your lot and review your options before finalizing.
          </p>

          {/* Steps */}
          <div className="flex flex-col gap-4 mb-8">
            {[
              {
                num: "01",
                label: "Select Lots",
                done: confirmedLots.length > 0,
                active: confirmedLots.length === 0,
              },
              {
                num: "02",
                label: "Buyer Information",
                done: false,
                active: confirmedLots.length > 0,
              },
              { num: "03", label: "Payment Terms", done: false, active: false },
              { num: "04", label: "Review & Sign", done: false, active: false },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-start gap-3 p-3 rounded-lg border-[1.5px] bg-white transition hover:bg-[#f5f5f3] ${
                  s.done
                    ? "border-[#b28648] bg-[#fef8f2]"
                    : s.active
                      ? "border-[#060503] bg-[#f5f1eb]"
                      : "border-[#d6d3d1]"
                }`}
              >
                <div
                  className={`w-9 h-9 flex items-center justify-center font-mono text-sm font-semibold rounded-full border-[1.5px] ${
                    s.active
                      ? "bg-[#060503] border-[#060503] text-[#b28648]"
                      : s.done
                        ? "bg-[#b28648] border-[#b28648] text-white"
                        : "bg-[#f7f7f7] border-[#d6d3d1] text-[#6b6b6b]"
                  }`}
                >
                  {s.done ? "✔" : s.num}
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`block text-[0.875rem] font-sans ${s.active ? "text-[#060503] font-semibold" : s.done ? "text-[#b28648]" : "text-[#6b6b6b]"}`}
                  >
                    {s.label}
                    {s.done && confirmedLots.length > 0
                      ? ` · ${confirmedLots.length} lot${confirmedLots.length !== 1 ? "s" : ""}`
                      : ""}
                  </span>
                  {s.done && confirmedLots.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {confirmedLots.map((l) => (
                        <div
                          key={l.lot_available}
                          className="flex items-center gap-2"
                        >
                          <span className="font-mono text-[0.75rem] text-[#b28648] bg-[rgba(178,134,72,0.12)] px-2 py-0.5 rounded">
                            {l.lot_available}
                          </span>
                          <span className="font-mono text-[0.7rem] text-[#060503] bg-[#f7f7f7] border border-[#d6d3d1] rounded px-2 py-0.5">
                            {termById(l.term_id)?.label} ·{" "}
                            {termById(l.term_id)?.sublabel}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Primary Button */}
          <button
            className={`w-full py-3.5 rounded border font-sans text-[0.875rem] tracking-wide uppercase flex items-center justify-center gap-2 transition-all duration-200 ${
              confirmedLots.length > 0
                ? "bg-transparent text-[#060503] border-[#060503] hover:bg-[#f5f1eb]"
                : "bg-[#b28648] text-white shadow hover:bg-[#a5743e]"
            }`}
            onClick={() => setDialogOpen(true)}
            disabled={loading}
          >
            {confirmedLots.length === 0 ? "Select Lots" : "Edit Lot Selection"}
          </button>
        </div>

        {/* Dialog */}
        {dialogOpen && !loading && (
          <SelectLotDialog
            initial={confirmedLots}
            paymentTerms={paymentTerms}
            onConfirm={(lots) => {
              setConfirmedLots(lots);
              setDialogOpen(false);
            }}
            onClose={() => setDialogOpen(false)}
          />
        )}
      </div>
    </>
  );
}
