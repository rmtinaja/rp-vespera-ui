import { useState, useMemo, useEffect } from "react";
import { PurchaseAgreementService } from "../../Services/pa.service";
import { AvailableLotsResponse, LotTypeResponse } from "../../DTO/pa.dto";

const MAX_LOTS = 10; // Changed from 1 to 10 to match your dialog

type Lot = { lottype_name: string; lot_available: string };
type LotWithTerm = Lot & { term_id: string };

function parseLot(lot: string) {
  const [block, section, lotNum] = lot.split("-").map(Number);
  return { block, section, lotNum };
}

function getUniqueLotTypes(lots: Lot[]) {
  return Array.from(new Set(lots.map((l) => l.lottype_name)));
}

export default function StepSelectLots({
  initial,
  onNext,
  onClose,
  availableLots, // Receive available lots from parent
  lotTypes, // Receive lot types from parent
}: {
  initial: Lot[];
  onNext: (lots: Lot[]) => void;
  onClose: () => void;
  availableLots: Lot[]; // Dynamic lots from API
  lotTypes: string[]; // Dynamic lot types from API
}) {
  const [selectedType, setSelectedType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [pending, setPending] = useState<Lot[]>(initial);

  const atMax = pending.length >= MAX_LOTS;

  const filtered = useMemo(() => {
    let result = [...availableLots];
    if (selectedType !== "ALL")
      result = result.filter((l) => l.lottype_name === selectedType);
    if (searchQuery.trim())
      result = result.filter((l) =>
        l.lot_available.includes(searchQuery.trim()),
      );
    result.sort((a, b) => {
      const pa = parseLot(a.lot_available),
        pb = parseLot(b.lot_available);
      const d =
        pa.block !== pb.block
          ? pa.block - pb.block
          : pa.section !== pb.section
            ? pa.section - pb.section
            : pa.lotNum - pb.lotNum;
      return sortOrder === "asc" ? d : -d;
    });
    return result;
  }, [availableLots, selectedType, searchQuery, sortOrder]);

  function toggleLot(lot: Lot) {
    const isSel = pending.some((p) => p.lot_available === lot.lot_available);
    if (isSel)
      setPending(pending.filter((p) => p.lot_available !== lot.lot_available));
    else if (!atMax) setPending([...pending, lot]);
  }

  return (
    <>
      {/* Tray */}
      <div className="dlg-tray">
        <div className="dlg-tray-row">
          <span className="dlg-tray-label">Selected:</span>
          <div className="dlg-tray-tags">
            {pending.length === 0 ? (
              <span className="dlg-tray-empty">No lots selected yet</span>
            ) : (
              pending.map((lot) => (
                <span key={lot.lot_available} className="dlg-tag">
                  {lot.lot_available}
                  <button
                    className="dlg-tag-rm"
                    onClick={() =>
                      setPending(
                        pending.filter(
                          (p) => p.lot_available !== lot.lot_available,
                        ),
                      )
                    }
                  >
                    ✕
                  </button>
                </span>
              ))
            )}
          </div>
          <span className="dlg-counter">
            <span className="cur">{pending.length}</span>
            <span className="max"> / {MAX_LOTS}</span>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="dlg-filters">
        <div className="dlg-search">
          <svg viewBox="0 0 20 20" fill="none" className="si">
            <circle
              cx="9"
              cy="9"
              r="6"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M13.5 13.5L17 17"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search lot…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button className="dlg-clr" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>
        <div className="dlg-chips">
          <button
            className={`chip ${selectedType === "ALL" ? "on" : ""}`}
            onClick={() => setSelectedType("ALL")}
          >
            All
          </button>
          {lotTypes.map((t) => (
            <button
              key={t}
              className={`chip ${selectedType === t ? "on" : ""}`}
              onClick={() => setSelectedType(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          className="dlg-sort"
          onClick={() => setSortOrder((s) => (s === "asc" ? "desc" : "asc"))}
        >
          <svg viewBox="0 0 20 20" fill="none" width="13" height="13">
            <path
              d="M5 4v12M5 16l-3-3M5 16l3-3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 16V4M15 4l-3 3M15 4l3 3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      {/* Meta */}
      <div className="dlg-meta">
        <span className="dlg-cnt">
          {filtered.length} lot{filtered.length !== 1 ? "s" : ""} available
        </span>
        {atMax && (
          <span className="dlg-maxwarn">
            ⚠ Maximum of {MAX_LOTS} lots reached
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="dlg-body">
        {filtered.length === 0 ? (
          <div className="dlg-empty">
            <svg viewBox="0 0 48 48" fill="none" width="38" height="38">
              <rect
                x="8"
                y="8"
                width="32"
                height="32"
                rx="4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M18 24h12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p>No lots match your filter.</p>
            <button
              className="dlg-reset"
              onClick={() => {
                setSearchQuery("");
                setSelectedType("ALL");
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="dlg-grid">
            {filtered.map((lot) => {
              const { block, section, lotNum } = parseLot(lot.lot_available);
              const isSel = pending.some(
                (p) => p.lot_available === lot.lot_available,
              );
              const isDimmed = atMax && !isSel;
              return (
                <button
                  key={lot.lot_available}
                  className={`lcard ${isSel ? "sel" : ""} ${isDimmed ? "dimmed" : ""}`}
                  onClick={() => toggleLot(lot)}
                  disabled={isDimmed}
                >
                  {isSel && (
                    <div className="lcheck">
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        width="11"
                        height="11"
                      >
                        <path
                          d="M3 8l3.5 3.5L13 5"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                  <span className="lnum">{lot.lot_available}</span>
                  <span className="lmeta">
                    Block {block} · Sec {section} · Lot {lotNum}
                  </span>
                  <span className="lbadge">{lot.lottype_name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="dlg-ft">
        <div className="dlg-ft-left">
          {pending.length > 0 ? (
            <>
              <strong>{pending.length}</strong> lot
              {pending.length !== 1 ? "s" : ""} selected
            </>
          ) : (
            "Select at least 1 lot to continue"
          )}
        </div>
        <div className="dlg-ft-btns">
          <button className="dlg-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`dlg-confirm ${pending.length > 0 ? "on" : "off"}`}
            disabled={pending.length === 0}
            onClick={() => pending.length > 0 && onNext(pending)}
          >
            Next: Set Terms
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
      </div>
    </>
  );
}