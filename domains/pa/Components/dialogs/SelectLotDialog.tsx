import { useState, useEffect } from "react";
import SelectLot from "../forms/SelectLot";
import AssignTerms from "../forms/AsignTerms";

const MAX_LOTS = 10;

type Lot = { lottype_name: string; lot_available: string };
type LotWithTerm = Lot & { term_id: string };
type PaymentTerm = { id: string; label: string; sublabel: string; months: number };

function parseLot(lot: string) {
  const [block, section, lotNum] = lot.split("-").map(Number);
  return { block, section, lotNum };
}

function getUniqueLotTypes(lots: Lot[]) {
  return Array.from(new Set(lots.map((l) => l.lottype_name)));
}

type SelectLotDialogProps = {
  initial: LotWithTerm[];
  availableLots: LotWithTerm[];
  paymentTerms: PaymentTerm[];
  onConfirm: (lots: LotWithTerm[]) => void;
  onClose: () => void;
};

export default function SelectLotDialog({
  initial,
  availableLots,
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
  const lotTypes = getUniqueLotTypes(availableLots);

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
        @keyframes dlg-in  { from{opacity:0}to{opacity:1} }
        @keyframes panel-in {
          from{opacity:0;transform:translateY(20px) scale(0.97)}
          to  {opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes tag-pop { from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)} }
        @keyframes slide-right { from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)} }
        @keyframes slide-left  { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }

        .dlg-backdrop {
          position:fixed;inset:0;z-index:1000;
          background:rgba(10,10,20,0.6);backdrop-filter:blur(5px);
          display:flex;align-items:center;justify-content:center;padding:1rem;
          animation:dlg-in 0.2s ease;
          font-family:'Georgia','Times New Roman',serif;
        }
        .dlg-panel {
          background:#faf8f4;border-radius:16px;width:100%;max-width:860px;
          max-height:92vh;display:flex;flex-direction:column;overflow:hidden;
          box-shadow:0 24px 64px rgba(10,10,20,0.3),0 0 0 1px rgba(212,175,106,0.12);
          animation:panel-in 0.28s cubic-bezier(0.16,1,0.3,1);
        }

        /* ── Header ── */
        .dlg-hd {
          display:flex;align-items:center;justify-content:space-between;
          padding:1.2rem 1.75rem 1rem;background:#1a1a2e;flex-shrink:0;
        }
        .dlg-hd-left{display:flex;align-items:center;gap:1rem;}
        .dlg-badge {
          width:44px;height:44px;border-radius:50%;
          background:rgba(212,175,106,0.12);border:1.5px solid rgba(212,175,106,0.28);
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
        }
        .dlg-badge span{color:#d4af6a;font-family:'Courier New',monospace;font-size:0.9rem;font-weight:700;letter-spacing:1px;}
        .dlg-eyebrow{font-family:'Courier New',monospace;font-size:0.58rem;letter-spacing:2.5px;color:#8a9bb5;text-transform:uppercase;margin:0 0 0.18rem;}
        .dlg-title{font-size:1.22rem;font-weight:700;color:#f5f1eb;margin:0;}
        .dlg-hd-right{display:flex;align-items:center;gap:0.75rem;}

        /* step pills */
        .dlg-steps-pill{display:flex;gap:0.35rem;}
        .dlg-step-pill {
          padding:0.28rem 0.7rem;border-radius:20px;
          font-family:'Courier New',monospace;font-size:0.65rem;letter-spacing:1px;
          text-transform:uppercase;transition:all 0.2s;
        }
        .dlg-step-pill.done{background:rgba(45,122,79,0.25);color:#6dd6a2;border:1px solid rgba(45,122,79,0.3);}
        .dlg-step-pill.active{background:rgba(212,175,106,0.18);color:#d4af6a;border:1px solid rgba(212,175,106,0.3);}
        .dlg-step-pill.idle{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.25);border:1px solid rgba(255,255,255,0.08);}

        .dlg-close {
          width:32px;height:32px;border-radius:8px;
          background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);
          color:#8a9bb5;display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:all 0.15s;font-size:0.85rem;
        }
        .dlg-close:hover{background:rgba(255,255,255,0.13);color:#f5f1eb;}

        /* ── Tray ── */
        .dlg-tray{padding:0.7rem 1.75rem;background:#1a1a2e;border-top:1px solid rgba(255,255,255,0.07);flex-shrink:0;}
        .dlg-tray-row{display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;}
        .dlg-tray-label{font-family:'Courier New',monospace;font-size:0.65rem;letter-spacing:1.5px;color:#8a9bb5;text-transform:uppercase;white-space:nowrap;flex-shrink:0;}
        .dlg-tray-tags{display:flex;flex-wrap:wrap;gap:0.38rem;flex:1;}
        .dlg-tag{display:flex;align-items:center;gap:0.3rem;background:rgba(212,175,106,0.15);border:1px solid rgba(212,175,106,0.3);border-radius:6px;padding:0.2rem 0.32rem 0.2rem 0.52rem;font-family:'Courier New',monospace;font-size:0.7rem;color:#d4af6a;animation:tag-pop 0.15s ease;}
        .dlg-tag-rm{background:none;border:none;color:rgba(212,175,106,0.5);cursor:pointer;font-size:0.68rem;line-height:1;padding:0 1px;transition:color 0.1s;}
        .dlg-tag-rm:hover{color:#d4af6a;}
        .dlg-tray-empty{font-family:'Courier New',monospace;font-size:0.7rem;color:rgba(255,255,255,0.2);font-style:italic;}
        .dlg-counter{margin-left:auto;flex-shrink:0;font-family:'Courier New',monospace;font-size:0.7rem;}
        .dlg-counter .cur{color:#d4af6a;font-weight:700;}
        .dlg-counter .max{color:rgba(255,255,255,0.25);}

        /* ── Apply-all bar ── */
        .terms-applyall{
          padding:0.8rem 1.75rem;background:#f5f1eb;
          border-bottom:1px solid #e8e3da;flex-shrink:0;
          display:flex;flex-wrap:wrap;align-items:center;gap:0.6rem;
        }
        .terms-applyall-label{font-family:'Courier New',monospace;font-size:0.68rem;letter-spacing:0.5px;color:#6b6156;white-space:nowrap;}
        .terms-applyall-chips{display:flex;flex-wrap:wrap;gap:0.32rem;}

        /* ── Filters ── */
        .dlg-filters{padding:0.85rem 1.75rem;background:#f5f1eb;border-bottom:1px solid #e8e3da;flex-shrink:0;display:flex;flex-wrap:wrap;gap:0.6rem;align-items:center;}
        .dlg-search{position:relative;display:flex;align-items:center;background:#fff;border:1.5px solid #ddd8ce;border-radius:8px;padding:0 0.65rem;flex:1;min-width:160px;max-width:230px;}
        .si{width:14px;height:14px;color:#8a7e6e;flex-shrink:0;}
        .dlg-search input{border:none;background:transparent;padding:0.5rem 0.4rem;font-size:0.82rem;color:#1a1a2e;outline:none;width:100%;font-family:inherit;}
        .dlg-search input::placeholder{color:#b0a898;}
        .dlg-clr{background:none;border:none;color:#8a7e6e;cursor:pointer;font-size:0.68rem;padding:2px 3px;line-height:1;}
        .dlg-chips{display:flex;flex-wrap:wrap;gap:0.32rem;}
        .chip{padding:0.33rem 0.75rem;border-radius:20px;border:1.5px solid #ddd8ce;background:#fff;font-size:0.68rem;font-family:'Courier New',monospace;letter-spacing:0.5px;color:#5a5040;cursor:pointer;transition:all 0.13s;text-transform:uppercase;}
        .chip:hover{border-color:#1a1a2e;color:#1a1a2e;}
        .chip.on{background:#1a1a2e;border-color:#1a1a2e;color:#d4af6a;}
        .dlg-sort{display:flex;align-items:center;gap:0.32rem;padding:0.33rem 0.72rem;border:1.5px solid #ddd8ce;border-radius:8px;background:#fff;font-size:0.68rem;font-family:'Courier New',monospace;color:#5a5040;cursor:pointer;transition:all 0.13s;white-space:nowrap;letter-spacing:0.5px;}
        .dlg-sort:hover{border-color:#1a1a2e;color:#1a1a2e;}

        /* ── Meta ── */
        .dlg-meta{padding:0.5rem 1.75rem;background:#faf8f4;border-bottom:1px solid #e8e3da;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;}
        .dlg-cnt{font-family:'Courier New',monospace;font-size:0.72rem;color:#8a7e6e;letter-spacing:0.5px;}
        .dlg-maxwarn{font-family:'Courier New',monospace;font-size:0.72rem;color:#b85c38;background:#fdf1ec;border:1px solid #f5c9b5;border-radius:20px;padding:0.18rem 0.6rem;}
        .dlg-allset{font-family:'Courier New',monospace;font-size:0.72rem;color:#2d7a4f;background:#edf7f2;border:1px solid #b5dfc9;border-radius:20px;padding:0.18rem 0.6rem;}

        /* ── Body ── */
        .dlg-body{overflow-y:auto;padding:1.2rem 1.75rem;flex:1;}
        .dlg-body::-webkit-scrollbar{width:5px;}
        .dlg-body::-webkit-scrollbar-track{background:transparent;}
        .dlg-body::-webkit-scrollbar-thumb{background:#ddd8ce;border-radius:3px;}

        /* ── Lot grid ── */
        .dlg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:0.7rem;}
        .lcard{position:relative;background:#fff;border:1.5px solid #e0dbd1;border-radius:10px;padding:0.85rem 0.85rem 0.72rem;cursor:pointer;text-align:left;transition:all 0.15s;font-family:inherit;}
        .lcard:hover:not(.sel):not(.dimmed){border-color:#1a1a2e;background:#f5f1eb;transform:translateY(-2px);box-shadow:0 4px 12px rgba(26,26,46,0.08);}
        .lcard.sel{border-color:#1a1a2e;background:#1a1a2e;transform:translateY(-2px);box-shadow:0 6px 18px rgba(26,26,46,0.2);}
        .lcard.dimmed{opacity:0.38;cursor:not-allowed;}
        .lcheck{position:absolute;top:0.42rem;right:0.42rem;width:19px;height:19px;background:#d4af6a;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#1a1a2e;}
        .lnum{font-size:0.97rem;font-weight:700;letter-spacing:0.5px;color:#1a1a2e;margin-bottom:0.4rem;font-family:'Courier New',monospace;display:block;}
        .lcard.sel .lnum{color:#d4af6a;}
        .lmeta{font-size:0.65rem;color:#8a7e6e;font-family:'Courier New',monospace;display:block;margin-bottom:0.28rem;}
        .lcard.sel .lmeta{color:#8a9bb5;}
        .lbadge{font-size:0.57rem;font-family:'Courier New',monospace;letter-spacing:0.8px;text-transform:uppercase;color:#a08c5a;background:#f0e8d4;border-radius:4px;padding:0.1rem 0.32rem;display:inline-block;}
        .lcard.sel .lbadge{background:rgba(212,175,106,0.15);color:#d4af6a;}

        /* ── Terms list ── */
        .terms-list{display:flex;flex-direction:column;gap:0.9rem;}
        .term-row{border-radius:12px;border:1.5px solid #e0dbd1;background:#fff;overflow:hidden;transition:border-color 0.2s;}
        .term-row.assigned{border-color:#b5dfc9;}
        .term-row-lot{display:flex;align-items:center;gap:0.85rem;padding:0.85rem 1rem 0.75rem;border-bottom:1px solid #f0ede5;}
        .term-row-index{font-family:'Courier New',monospace;font-size:0.65rem;color:#b0a898;font-weight:700;flex-shrink:0;width:20px;}
        .term-row-lotinfo{flex:1;min-width:0;}
        .term-row-lotnum{font-family:'Courier New',monospace;font-size:1rem;font-weight:700;color:#1a1a2e;display:block;}
        .term-row-lotmeta{font-family:'Courier New',monospace;font-size:0.65rem;color:#8a7e6e;display:block;margin-top:0.12rem;}
        .term-row-lottype{font-family:'Courier New',monospace;font-size:0.58rem;letter-spacing:0.8px;text-transform:uppercase;color:#a08c5a;background:#f0e8d4;border-radius:4px;padding:0.1rem 0.32rem;display:inline-block;margin-top:0.25rem;}
        .term-row-badge{margin-left:auto;text-align:right;flex-shrink:0;}
        .term-row-badge-main{font-family:'Courier New',monospace;font-size:0.82rem;font-weight:700;color:#2d7a4f;display:block;}
        .term-row-badge-sub{font-family:'Courier New',monospace;font-size:0.65rem;color:#6db58a;display:block;}

        /* term options row */
        .term-options{display:flex;flex-wrap:wrap;gap:0.5rem;padding:0.75rem 1rem;}
        .term-opt{
          position:relative;flex:1;min-width:80px;
          padding:0.55rem 0.65rem;border-radius:8px;
          border:1.5px solid #e0dbd1;background:#faf8f4;
          cursor:pointer;text-align:left;transition:all 0.15s;font-family:inherit;
        }
        .term-opt:hover:not(.sel){border-color:#1a1a2e;background:#f0ede5;}
        .term-opt.sel{border-color:#2d7a4f;background:#edf7f2;}
        .term-opt-label{font-family:'Courier New',monospace;font-size:0.78rem;font-weight:700;color:#1a1a2e;display:block;}
        .term-opt.sel .term-opt-label{color:#2d7a4f;}
        .term-opt-sub{font-family:'Courier New',monospace;font-size:0.62rem;color:#8a7e6e;display:block;margin-top:0.1rem;}
        .term-opt.sel .term-opt-sub{color:#6db58a;}
        .term-opt-check{position:absolute;top:0.38rem;right:0.38rem;width:16px;height:16px;background:#2d7a4f;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;}

        /* ── Empty ── */
        .dlg-empty{text-align:center;padding:3rem 1rem;color:#8a7e6e;display:flex;flex-direction:column;align-items:center;gap:0.7rem;border:1.5px dashed #ddd8ce;border-radius:12px;}
        .dlg-empty p{margin:0;font-size:0.87rem;font-style:italic;}
        .dlg-reset{background:none;border:1px solid #ddd8ce;border-radius:6px;padding:0.36rem 0.8rem;font-size:0.77rem;color:#5a5040;cursor:pointer;font-family:'Courier New',monospace;letter-spacing:0.5px;}
        .dlg-reset:hover{border-color:#1a1a2e;color:#1a1a2e;}

        /* ── Footer ── */
        .dlg-ft{padding:0.9rem 1.75rem;border-top:1px solid #e8e3da;background:#f5f1eb;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:1rem;}
        .dlg-ft-left{font-family:'Courier New',monospace;font-size:0.75rem;color:#8a7e6e;}
        .dlg-ft-left strong{color:#1a1a2e;}
        .dlg-ft-btns{display:flex;gap:0.6rem;align-items:center;}
        .dlg-cancel{display:flex;align-items:center;gap:0.25rem;padding:0.65rem 1.3rem;border-radius:8px;border:1.5px solid #ddd8ce;background:transparent;font-family:'Courier New',monospace;font-size:0.75rem;letter-spacing:0.8px;text-transform:uppercase;color:#5a5040;cursor:pointer;transition:all 0.15s;}
        .dlg-cancel:hover{border-color:#1a1a2e;color:#1a1a2e;}
        .dlg-confirm{display:flex;align-items:center;gap:0.5rem;padding:0.7rem 1.5rem;border-radius:8px;border:none;font-family:'Courier New',monospace;font-size:0.78rem;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all 0.2s;}
        .dlg-confirm.on{background:#1a1a2e;color:#d4af6a;box-shadow:0 4px 14px rgba(26,26,46,0.2);}
        .dlg-confirm.on:hover{background:#2d2d4e;transform:translateY(-1px);}
        .dlg-confirm.off{background:#e8e3da;color:#b0a898;cursor:not-allowed;}
      `}</style>
      <div
        className="dlg-backdrop"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="dlg-panel" role="dialog" aria-modal="true">
          {/* Header */}
          <div className="dlg-hd">
            <div className="dlg-hd-left">
              <div className="dlg-badge">
                <span>01</span>
              </div>
              <div>
                <p className="dlg-eyebrow">Step 1 of 4 · Purchase Agreement</p>
                <h2 className="dlg-title">{stepLabel}</h2>
              </div>
            </div>
            <div className="dlg-hd-right">
              <div className="dlg-steps-pill">
                <span
                  className={`dlg-step-pill ${step > 1 ? "done" : step === 1 ? "active" : "idle"}`}
                >
                  1 · Lots
                </span>
                <span
                  className={`dlg-step-pill ${step === 2 ? "active" : "idle"}`}
                >
                  2 · Terms
                </span>
              </div>
              <button
                className="dlg-close"
                onClick={onClose}
                aria-label="Close"
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
              availableLots={availableLots}
              lotTypes={lotTypes}
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