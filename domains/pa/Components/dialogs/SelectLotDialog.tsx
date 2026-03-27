import { useState, useEffect } from "react";
import SelectLot from "../forms/SelectLot";
import AssignTerms from "../forms/AsignTerms";

const MAX_LOTS = 10;

type Lot = { lottype_name: string; lot_available: string };
type LotWithTerm = Lot & { term_id: string };
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

type SelectLotDialogProps = {
  initial: LotWithTerm[];
  paymentTerms: PaymentTerm[];
  onConfirm: (lots: LotWithTerm[]) => void;
  onClose: () => void;
};

export default function SelectLotDialog({
  initial,
  paymentTerms,
  onConfirm,
  onClose,
}: SelectLotDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedLots, setSelectedLots] = useState<Lot[]>(
    initial.map(({ lottype_name, lot_available }) => ({
      lottype_name,
      lot_available,
    })),
  );
  const [lotTerms, setLotTerms] = useState<Record<string, string>>(
    Object.fromEntries(initial.map((l) => [l.lot_available, l.term_id])),
  );

  // Get unique lot types from available lots
  // const lotTypes = getUniqueLotTypes(availableLots);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleLotsNext(lots: Lot[]) {
    setSelectedLots(lots);
    // Clean up terms for removed lots
    const cleaned: Record<string, string> = {};
    lots.forEach((l) => {
      if (lotTerms[l.lot_available])
        cleaned[l.lot_available] = lotTerms[l.lot_available];
    });
    setLotTerms(cleaned);
    setStep(2);
  }

  function handleTermsConfirm(terms: Record<string, string>) {
    const result: LotWithTerm[] = selectedLots.map((l) => ({
      ...l,
      term_id: terms[l.lot_available],
    }));
    onConfirm(result);
  }

  const stepLabel = step === 1 ? "Select Lots" : "Payment Terms";

  return (
    <>
      <style>{`
        @keyframes panel-in {
          from{opacity:0;transform:translateY(20px) scale(0.97)}
          to  {opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes tag-pop { from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)} }
        @keyframes slide-right { from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)} }
        @keyframes slide-left  { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
      <div
        className="fixed inset-0 z-[1000] bg-[rgba(10,10,20,0.6)] backdrop-blur-[5px] 
             flex items-center justify-center p-4 font-[Georgia,'Times New Roman',serif] 
             animate-[dlg-in_0.2s_ease]"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-[#faf8f4] rounded-[16px] w-full max-w-[860px] max-h-[92vh] 
               flex flex-col overflow-hidden shadow-[0_24px_64px_rgba(10,10,20,0.3),0_0_0_1px_rgba(212,175,106,0.12)]
               animate-[panel-in_0.28s_cubic-bezier(0.16,1,0.3,1)]"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between p-[1.2rem 1.75rem 1rem] bg-[#1a1a2e] flex-shrink-0">
            <div className="flex item-center gap-[1rem] mx-5">
              <div>
                <p className="text-[0.58rem] tracking-[2.5px] text-[#8a9bb5] uppercase mt-5">
                  Purchase Agreement
                </p>
                <h2 className="text-lg font-bold text-[#f5f1eb]">
                  {stepLabel}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-[0.75rem] mr-3">
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 rounded-[8px] bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.1)] 
             text-[#8a9bb5] flex items-center justify-center cursor-pointer 
             text-[0.85rem] transition-all duration-150 
             hover:bg-[rgba(255,255,255,0.13)] hover:text-[#f5f1eb]"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Step content */}
          {step === 1 ? (
            <SelectLot
              initial={selectedLots}
              onNext={handleLotsNext}
              onClose={onClose}
            />
          ) : (
            <AssignTerms
              lots={selectedLots}
              initialTerms={lotTerms}
              onBack={() => setStep(1)}
              onConfirm={handleTermsConfirm}
              onClose={onClose}
              paymentTerms={paymentTerms}
            />
          )}
        </div>
      </div>
    </>
  );
}
