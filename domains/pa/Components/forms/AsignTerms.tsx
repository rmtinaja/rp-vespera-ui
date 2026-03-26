import { useState } from "react";

type Lot = { lottype_name: string; lot_available: string };
type PaymentTerm = { id: string; label: string; sublabel: string; months: number };

function parseLot(lot: string) {
  const [block, section, lotNum] = lot.split("-").map(Number);
  return { block, section, lotNum };
}

function termById(id: string, paymentTerms: PaymentTerm[]) {
  return paymentTerms.find((t) => t.id === id);
}

export default function AssignTerms({
  lots,
  initialTerms,
  onBack,
  onConfirm,
  onClose,
  paymentTerms, // Receive dynamic payment terms from parent
}: {
  lots: Lot[];
  initialTerms: Record<string, string>;
  onBack: () => void;
  onConfirm: (terms: Record<string, string>) => void;
  onClose: () => void;
  paymentTerms: PaymentTerm[]; // Dynamic payment terms from API
}) {
  const [terms, setTerms] = useState<Record<string, string>>(initialTerms);
  const [applyAll, setApplyAll] = useState<string>("");

  function setTerm(lotId: string, termId: string) {
    setTerms((prev) => ({ ...prev, [lotId]: termId }));
  }

  function handleApplyAll(termId: string) {
    setApplyAll(termId);
    const updated: Record<string, string> = {};
    lots.forEach((l) => { updated[l.lot_available] = termId; });
    setTerms(updated);
  }

  const allAssigned = lots.every((l) => !!terms[l.lot_available]);

  return (
    <>
      {/* Apply-all bar */}
      <div className="terms-applyall">
        <span className="terms-applyall-label">Apply same term to all lots:</span>
        <div className="terms-applyall-chips">
          {paymentTerms.map((t) => (
            <button 
              key={t.id} 
              className={`chip ${applyAll === t.id ? "on" : ""}`} 
              onClick={() => handleApplyAll(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Meta */}
      <div className="dlg-meta">
        <span className="dlg-cnt">Assign a payment term to each of the {lots.length} selected lot{lots.length !== 1 ? "s" : ""}</span>
        {allAssigned && <span className="dlg-allset">✓ All lots assigned</span>}
      </div>

      {/* Per-lot term cards */}
      <div className="dlg-body">
        <div className="terms-list">
          {lots.map((lot, idx) => {
            const { block, section, lotNum } = parseLot(lot.lot_available);
            const selectedTerm = terms[lot.lot_available];
            return (
              <div key={lot.lot_available} className={`term-row ${selectedTerm ? "assigned" : "unassigned"}`}>
                {/* Lot info */}
                <div className="term-row-lot">
                  <span className="term-row-index">{String(idx + 1).padStart(2, "0")}</span>
                  <div className="term-row-lotinfo">
                    <span className="term-row-lotnum">{lot.lot_available}</span>
                    <span className="term-row-lotmeta">Block {block} · Sec {section} · Lot {lotNum}</span>
                    <span className="term-row-lottype">{lot.lottype_name}</span>
                  </div>
                  {selectedTerm && (
                    <div className="term-row-badge">
                      <span className="term-row-badge-main">{termById(selectedTerm, paymentTerms)?.label}</span>
                      <span className="term-row-badge-sub">{termById(selectedTerm, paymentTerms)?.sublabel}</span>
                    </div>
                  )}
                </div>

                {/* Term options */}
                <div className="term-options">
                  {paymentTerms.map((t) => (
                    <button
                      key={t.id}
                      className={`term-opt ${selectedTerm === t.id ? "sel" : ""}`}
                      onClick={() => { setTerm(lot.lot_available, t.id); setApplyAll(""); }}
                    >
                      <span className="term-opt-label">{t.label}</span>
                      <span className="term-opt-sub">{t.sublabel}</span>
                      {selectedTerm === t.id && (
                        <div className="term-opt-check">
                          <svg viewBox="0 0 16 16" fill="none" width="9" height="9">
                            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="dlg-ft">
        <div className="dlg-ft-left">
          {allAssigned
            ? <span style={{color:"#2d7a4f"}}>✓ All {lots.length} lots have payment terms</span>
            : <span>{lots.filter((l) => !terms[l.lot_available]).length} lot{lots.filter((l) => !terms[l.lot_available]).length !== 1 ? "s" : ""} still need a term</span>}
        </div>
        <div className="dlg-ft-btns">
          <button className="dlg-cancel" onClick={onBack}>
            <svg viewBox="0 0 20 20" fill="none" width="14" height="14" style={{marginRight:"0.2rem"}}>
              <path d="M16 10H4M8 6l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <button className={`dlg-confirm ${allAssigned ? "on" : "off"}`} disabled={!allAssigned} onClick={() => allAssigned && onConfirm(terms)}>
            Confirm Selection
            <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}