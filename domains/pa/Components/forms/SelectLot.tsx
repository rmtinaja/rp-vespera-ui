import { useState, useMemo, useEffect } from "react";
import { PurchaseAgreementService } from "../../Services/pa.service";

const MAX_LOTS = 1; // Changed to 10

type Lot = { lottype_name: string; lot_available: string };
type LotWithTerm = Lot & { term_id: string };

function parseLot(lot: string) {
  const [block, section, lotNum] = lot.split("-").map(Number);
  return { block, section, lotNum };
}

export default function StepSelectLots({
  initial,
  onNext,
  onClose,
}: {
  initial: Lot[];
  onNext: (lots: Lot[]) => void;
  onClose: () => void;
}) {
  const [selectedType, setSelectedType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [pending, setPending] = useState<Lot[]>(initial);
  const [availableLots, setAvailableLots] = useState<Lot[]>([]);
  const [lotTypes, setLotTypes] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const atMax = pending.length >= MAX_LOTS;

  // Fetch lot types on mount
  useEffect(() => {
    async function fetchLotTypes() {
      try {
        const lotTypesRes = await PurchaseAgreementService.getLotTypes();
        const lotTypesMapped = (lotTypesRes.data.lottype || []).map((lt) => ({
          id: lt.mp_i_lottype_id.toString(),
          name: lt.type,
        }));
        setLotTypes(lotTypesMapped);

        // Set default selected type to first lot type
        if (lotTypesMapped.length > 0) {
          setSelectedType(lotTypesMapped[0].id);
        }
      } catch (err) {
        console.error("Error fetching lot types:", err);
        setError("Failed to load lot types");
      }
    }

    fetchLotTypes();
  }, []);

  // Fetch available lots when selected type changes
  useEffect(() => {
    async function fetchAvailableLots() {
      if (!selectedType) return;

      setLoading(true);
      setError(null);

      try {
        const lotsRes = await PurchaseAgreementService.getAvailableLots({
          lottype: selectedType, // Pass the selected lot type ID to API
        });

        // Map the lots to the expected format
        const mappedLots: Lot[] = lotsRes.data.lots.map((l) => ({
          lottype_name: l.lottype_name,
          lot_available: l.lot_available,
        }));

        setAvailableLots(mappedLots);
      } catch (err) {
        console.error("Error fetching available lots:", err);
        setError("Failed to load available lots");
        setAvailableLots([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailableLots();
  }, [selectedType]);

  const filtered = useMemo(() => {
    let result = [...availableLots];

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
  }, [availableLots, searchQuery, sortOrder]);

  function toggleLot(lot: Lot) {
    const isSel = pending.some((p) => p.lot_available === lot.lot_available);
    if (isSel)
      setPending(pending.filter((p) => p.lot_available !== lot.lot_available));
    else if (!atMax) setPending([...pending, lot]);
  }

  return (
    <>
      {/* Tray */}
      <div className="px-[1.75rem] py-[0.7rem] bg-[#1a1a2e] border-t border-[rgba(255,255,255,0.07)] flex-shrink-0">
        <div className="flex items-center gap-[0.5rem] flex-wrap">
          <span className=" text-[0.65rem] tracking-[1.5px] text-[#8a9bb5] uppercase whitespace-nowrap flex-shrink-0">
            Selected:
          </span>
          <div className="flex flex-wrap gap-[0.38rem] flex-1">
            {pending.length === 0 ? (
              <span className="text-[0.7rem] text-[rgba(255,255,255,0.2)] italic">
                No lots selected yet
              </span>
            ) : (
              pending.map((lot) => (
                <span
                  key={lot.lot_available}
                  className="flex items-center gap-[0.3rem] bg-[rgba(212,175,106,0.15)] border border-[rgba(212,175,106,0.3)] 
             rounded-[6px] px-[0.52rem] py-[0.2rem] pl-[0.52rem] text-[0.7rem] text-[#d4af6a] 
             animate-[tag-pop_0.15s_ease]"
                >
                  {lot.lot_available}
                  <button
                    className="bg-none border-none text-[rgba(212,175,106,0.5)] cursor-pointer text-[0.68rem] leading-[1] px-[1px] transition-colors duration-100 hover:text-[#d4af6a]"
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
          <span className="ml-auto flex-shrink-0 text-[0.7rem]">
            <span className="text-[#d4af6a] font-bold">{pending.length}</span>
            <span className="text-[rgba(255,255,255,0.25)]"> / {MAX_LOTS}</span>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div
        className="px-[1.75rem] py-[0.85rem] bg-[#f5f1eb] border-b border-[#e8e3da] 
                flex flex-wrap items-center gap-[0.6rem] flex-shrink-0"
      >
        {/* Search Input */}
        <div
          className="relative flex items-center bg-white border-[1.5px] border-[#ddd8ce] 
                  rounded-[8px] px-[0.65rem] flex-1 min-w-[160px] max-w-[230px]"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="w-[14px] h-[14px] text-[#8a7e6e] flex-shrink-0"
          >
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
            className="border-none bg-transparent px-[0.4rem] py-[0.5rem] text-[0.82rem] 
                 text-[#1a1a2e] outline-none w-full font-inherit placeholder:text-[#b0a898]"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="bg-none border-none text-[#8a7e6e] cursor-pointer text-[0.68rem] 
                   px-[3px] py-[2px] leading-[1]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Lot Type Selector */}
        <div className="flex flex-wrap gap-[0.32rem] items-center">
          <span className="text-[0.75rem] text-[#5a5040]">Lot Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded border border-[#ddd8ce] text-sm bg-white text-[#1a1a2e] font-medium cursor-pointer hover:border-[#1a1a2e] transition-colors"
            disabled={loading || lotTypes.length === 0}
          >
            {lotTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-y-auto flex-1 px-[1.75rem] py-[1.2rem]">
        {loading ? (
          <div className="flex flex-col items-center gap-[0.7rem] text-center border-[1.5px] border-dashed border-[#ddd8ce] rounded-[12px] px-[1rem] py-[3rem]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a2e]"></div>
            <p className="text-[#8a7e6e]">Loading available lots...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-[0.7rem] text-center border-[1.5px] border-dashed border-[#ddd8ce] rounded-[12px] px-[1rem] py-[3rem] text-[#8a7e6e]">
            <svg viewBox="0 0 48 48" fill="none" width="38" height="38">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M24 16v8M24 32h.01"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p>{error}</p>
            <button
              className="bg-none border border-[#ddd8ce] rounded-[6px] px-[0.8rem] py-[0.36rem] text-[0.77rem] tracking-[0.5px] text-[#5a5040] cursor-pointer transition-all hover:border-[#1a1a2e] hover:text-[#1a1a2e]"
              onClick={() => setSelectedType(selectedType)}
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-[0.7rem] text-center border-[1.5px] border-dashed border-[#ddd8ce] rounded-[12px] px-[1rem] py-[3rem] text-[#8a7e6e]">
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
            <p>No lots available for this lot type.</p>
            {searchQuery && (
              <button
                className="bg-none border border-[#ddd8ce] rounded-[6px] px-[0.8rem] py-[0.36rem] text-[0.77rem] tracking-[0.5px] text-[#5a5040] cursor-pointer transition-all hover:border-[#1a1a2e] hover:text-[#1a1a2e]"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(145px,1fr))] gap-[0.7rem]">
            {filtered.map((lot) => {
              const { block, section, lotNum } = parseLot(lot.lot_available);
              const isSel = pending.some(
                (p) => p.lot_available === lot.lot_available,
              );
              const isDimmed = atMax && !isSel;
              return (
                <button
                  key={lot.lot_available}
                  onClick={() => toggleLot(lot)}
                  disabled={isDimmed}
                  className={`relative text-left p-[0.85rem_0.85rem_0.72rem] rounded-[10px] border-[1.5px] transition-all font-inherit 
                        ${isSel ? "bg-[#1a1a2e] border-[#1a1a2e] shadow-[0_6px_18px_rgba(26,26,46,0.2)]" : "bg-white border-[#e0dbd1]"} 
                        ${isDimmed ? "opacity-38 cursor-not-allowed" : "hover:bg-[#f5f1eb] hover:border-[#1a1a2e] hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(26,26,46,0.08)]"}`}
                >
                  {isSel && (
                    <div className="absolute top-[0.42rem] right-[0.42rem] w-[19px] h-[19px] bg-[#d4af6a] rounded-full flex items-center justify-center text-[#1a1a2e]">
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
                  <span className="block font-bold text-[0.97rem] mb-[0.4rem]">
                    {lot.lot_available}
                  </span>
                  <span className="block text-[0.65rem] text-[#8a7e6e] mt-0 mb-[0.28rem]">
                    Block {block} · Sec {section} · Lot {lotNum}
                  </span>
                  <span
                    className={`inline-block text-[0.57rem] tracking-[0.8px] uppercase rounded-[4px] px-[0.32rem] py-[0.1rem] 
                             ${isSel ? "bg-[rgba(212,175,106,0.15)] text-[#d4af6a]" : "bg-[#f0e8d4] text-[#a08c5a]"}`}
                  >
                    {lot.lottype_name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-[1rem] px-[1.75rem] py-[0.9rem] border-t border-[#e8e3da] bg-[#f5f1eb]">
        {/* <div className="flex items-center gap-[0.6rem]"> */}
          <button
            className="flex items-center gap-[0.25rem] px-[1.3rem] py-[0.65rem] rounded-[8px] border-[1.5px] border-[#ddd8ce] text-[0.75rem] tracking-[0.8px] uppercase text-[#5a5040] bg-transparent transition-all hover:border-[#1a1a2e] hover:text-[#1a1a2e]"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className={`flex items-center gap-[0.5rem] px-[1.5rem] py-[0.7rem] rounded-[8px] text-xs tracking-[1px] uppercase transition-all ${
              pending.length > 0 && !loading
                ? "bg-[#1a1a2e] text-[#d4af6a] shadow-[0_4px_14px_rgba(26,26,46,0.2)] hover:bg-[#2d2d4e] hover:-translate-y-[1px] cursor-pointer"
                : "bg-[#e8e3da] text-[#b0a898] cursor-not-allowed"
            }`}
            disabled={pending.length === 0 || loading}
            onClick={() => pending.length > 0 && onNext(pending)}
          >
            Set Terms
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
        {/* </div> */}
      </div>
    </>
  );
}
