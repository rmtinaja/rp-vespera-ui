import { useState, useEffect } from "react";
import { PurchaseAgreementService } from "../../Services/pa.service";

type Lot = { lottype_name: string; lot_available: string };
type PaymentTerm = {
  id: string;
  label: string;
  sublabel: string;
  months: number;
};

function parseLot(lot: string) {
  const [block, section, lotNum] = lot.split("-").map(Number);
  return { block, section, lotNum };
}

function termById(id: string, paymentTerms: PaymentTerm[]) {
  return paymentTerms.find((t) => t.id === id);
}

// Session storage key for selected terms
const SESSION_KEY_TERMS = "assignedTerms";

export default function AssignTerms({
  lots,
  initialTerms,
  onBack,
  onConfirm,
  onClose,
  paymentTerms,
}: {
  lots: Lot[];
  initialTerms: Record<string, string>;
  onBack: () => void;
  onConfirm: (terms: Record<string, string>) => void;
  onClose: () => void;
  paymentTerms: PaymentTerm[];
}) {
  // Load from sessionStorage if exists, otherwise initialTerms
  const savedTerms = sessionStorage.getItem(SESSION_KEY_TERMS);
  const [terms, setTerms] = useState<Record<string, string>>(
    savedTerms ? JSON.parse(savedTerms) : initialTerms,
  );

  const [applyAll, setApplyAll] = useState<string>("");

  // Persist terms in sessionStorage whenever changed
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY_TERMS, JSON.stringify(terms));
  }, [terms]);

  async function setTerm(lotKey: string, termId: string) {
    setTerms((prev) => ({ ...prev, [lotKey]: termId }));
    setApplyAll("");

    // Find the selected lot
    const selectedLot = lots.find((l) => l.lot_available === lotKey);

    if (!selectedLot) return;

    const params = {
      lot_id: (selectedLot as any).lot_id, // make sure lot_id exists in type
      amort_term_id: Number(termId),
      payment_scheme_id: 1,
    };

    try {
      console.log(params);
      const res = await PurchaseAgreementService.checkAmortization(params);
      console.log("API Response:", res);

      // OPTIONAL: store per lot result
      sessionStorage.setItem(`pricing_${lotKey}`, JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to fetch amortization:", err);
    }
  }
  function handleApplyAll(termId: string) {
    setApplyAll(termId);
    const updated: Record<string, string> = {};
    lots.forEach((l) => {
      updated[l.lot_available] = termId;
    });
    setTerms(updated);
  }

  const allAssigned = lots.every((l) => !!terms[l.lot_available]);

  return (
    <>
      {/* Per-lot term cards */}
      <div className="overflow-y-auto flex-1 px-[1.75rem] py-[1.2rem]">
        <div className="flex flex-col gap-[0.9rem]">
          {lots.map((lot) => {
            const { block, section, lotNum } = parseLot(lot.lot_available);
            const selectedTerm = terms[lot.lot_available];

            return (
              <div
                key={lot.lot_available}
                className={`rounded-[12px] border-[1.5px] overflow-hidden transition-colors ${
                  selectedTerm
                    ? "border-[#b5dfc9] bg-white"
                    : "border-[#e0dbd1] bg-white"
                }`}
              >
                {/* Lot info */}
                <div className="flex items-center gap-[0.85rem] px-[1rem] py-[0.85rem] border-b border-[#f0ede5]">
                  <div className="flex-1 min-w-0">
                    <span className="block text-[1rem] font-bold text-[#1a1a2e]">
                      {lot.lot_available}
                    </span>
                    <span className="block text-[0.65rem] text-[#8a7e6e] mt-[0.12rem]">
                      Block {block} · Sec {section} · Lot {lotNum}
                    </span>
                    <span className="inline-block text-[0.58rem] tracking-[0.8px] uppercase text-[#a08c5a] bg-[#f0e8d4] rounded-[4px] px-[0.32rem] py-[0.1rem] mt-[0.25rem]">
                      {lot.lottype_name}
                    </span>
                  </div>
                </div>

                {/* Dropdown for Payment Terms */}
                <div className="px-[1rem] py-[0.75rem]">
                  <select
                    className="w-full text-[0.78rem] border-[1.5px] rounded-[8px] px-[0.65rem] py-[0.55rem] transition-all bg-[#faf8f4] border-[#e0dbd1] focus:border-[#2d7a4f] focus:bg-[#edf7f2]"
                    value={selectedTerm || ""}
                    onChange={(e) => setTerm(lot.lot_available, e.target.value)}
                  >
                    <option value="" disabled>
                      Select Payment Term
                    </option>
                    {paymentTerms.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label} — {t.sublabel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-[1rem] px-[1.75rem] py-[0.9rem] border-t border-[#e8e3da] bg-[#f5f1eb] flex-shrink-0">
        <button
          className="flex items-center gap-[0.2rem] px-[1.3rem] py-[0.65rem] rounded-[8px] border-[1.5px] border-[#ddd8ce] bg-transparent text-[0.75rem]  text-[#5a5040] uppercase tracking-[0.8px] transition-all hover:border-[#1a1a2e] hover:text-[#1a1a2e]"
          onClick={onBack}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            width="14"
            height="14"
            style={{ marginRight: "0.2rem" }}
          >
            <path
              d="M16 10H4M8 6l-4 4 4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
        <button
          className={`flex items-center gap-[0.5rem] px-[1.5rem] py-[0.7rem] rounded-[8px] text-[0.78rem] font-[\"Courier New\",monospace] uppercase tracking-[1px] transition-all ${
            allAssigned
              ? "bg-[#1a1a2e] text-[#d4af6a] shadow-[0_4px_14px_rgba(26,26,46,0.2)] hover:bg-[#2d2d4e] hover:-translate-y-[1px]"
              : "bg-[#e8e3da] text-[#b0a898] cursor-not-allowed"
          }`}
          disabled={!allAssigned}
          onClick={() => allAssigned && onConfirm(terms)}
        >
          Confirm
          <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
            <path
              d="M4 10h12M12 6l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
