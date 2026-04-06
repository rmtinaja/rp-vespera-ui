import { useState, useEffect } from "react";
import { PurchaseAgreementService } from "../../Services/pa.service";
import Loading from "../dialogs/Loading";

const MAX_LOTS = 1;
const SESSION_KEY_LOTS = "selectedLots";
const SESSION_KEY_INPUTS = "lotInputs";

type Lot = { lottype_name: string; lot_available: string; lot_id?: string };

export default function StepSelectLots({
  initial,
  onNext,
  onClose,
}: {
  initial: Lot[];
  onNext: (lots: Lot[]) => void;
  onClose: () => void;
}) {
  // Load partially typed inputs from sessionStorage
  const savedInputs = sessionStorage.getItem(SESSION_KEY_INPUTS);
  const initialInputs = savedInputs
    ? JSON.parse(savedInputs)
    : { area: "", block: "", lotNo: "" };
  const [adding, setAdding] = useState(false);
  const [area, setArea] = useState(initialInputs.area);
  const [block, setBlock] = useState(initialInputs.block);
  const [lotNo, setLotNo] = useState(initialInputs.lotNo);
  const [selectedType, setSelectedType] = useState("");
  const [pending, setPending] = useState<Lot[]>(() => {
    const saved = sessionStorage.getItem(SESSION_KEY_LOTS);
    return saved ? JSON.parse(saved) : initial;
  });
  const [lotTypes, setLotTypes] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const atMax = pending.length >= MAX_LOTS;

  // Persist pending lots
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY_LOTS, JSON.stringify(pending));
  }, [pending]);

  // Persist partially typed inputs
  useEffect(() => {
    sessionStorage.setItem(
      SESSION_KEY_INPUTS,
      JSON.stringify({ area, block, lotNo }),
    );
  }, [area, block, lotNo]);

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
        if (lotTypesMapped.length > 0) {
          setSelectedType(lotTypesMapped[0].id);
        }
      } catch (err) {
        console.error("Error fetching lot types:", err);
        setError("Failed to load lot types");
      } finally {
        setLoading(false);
      }
    }
    fetchLotTypes();
  }, []);

  async function handleAdd() {
    setFieldError(null);
    setAdding(true);
    if (!area.trim() || !block.trim() || !lotNo.trim()) {
      setFieldError("Please fill in all fields.");
      return;
    }

    if (atMax) {
      setFieldError(`Maximum of ${MAX_LOTS} lot(s) allowed.`);
      return;
    }

    const lotAvailable = `${area.trim()}-${block.trim()}-${lotNo.trim()}`;
    const selectedLotType = lotTypes.find((t) => t.id === selectedType);

    if (pending.some((p) => p.lot_available === lotAvailable)) {
      setFieldError("This lot is already added.");
      return;
    }

    if (!selectedLotType) {
      setFieldError("Please select a lot type.");
      return;
    }

    try {
      const res = await PurchaseAgreementService.checkAvailability({
        lot_identifier: lotAvailable,
        lottype: selectedLotType.id,
      });

      if (res.success && res.data?.lot) {
        const lotData = res.data.lot;
        const newLot: Lot = {
          lot_available: `${lotData.area_no}-${lotData.block_no}-${lotData.lot_no}`,
          lottype_name: lotData.lottype_name,
          lot_id: lotData.lot_id,
        };
        setPending([...pending, newLot]);
        setArea("");
        setBlock("");
        setLotNo("");
      } else {
        setFieldError(res.message || "Lot is not available.");
      }
    } catch (err: any) {
      console.error("Error checking lot:", err);
      setFieldError(
        err.response?.data?.message ||
        "Failed to check lot availability. Try again.",
      );
    } finally {
      setAdding(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleAdd();
  }

  return (
    <>
      {/* Body */}
      <div className={`relative flex-1 overflow-y-auto px-[1.75rem] py-[1.4rem] bg-[#f5f1eb] ${adding ? "pointer-events-none" : ""}`}>
        {adding && <Loading text="Checking lot availability..." />}
        {pending.length === 0 && (
          <>
            <div className="mb-[1.2rem]">
              <label className="block text-[0.7rem] tracking-[1.2px] uppercase text-[#5a5040] font-semibold mb-[0.45rem]">
                Lot Type
              </label>

              {loading ? (
                <div className="flex items-center gap-2 text-[#8a7e6e] text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1a1a2e]" />
                  Loading...
                </div>
              ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
              ) : (
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-[0.85rem] py-[0.65rem] rounded-[8px] border-[1.5px] border-[#ddd8ce] bg-white text-[0.85rem] text-[#1a1a2e] font-medium cursor-pointer hover:border-[#1a1a2e] transition-colors outline-none focus:border-[#1a1a2e]"
                >
                  {lotTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Structured Lot Input */}
            <div className="mb-[0.6rem]">
              <label className="block text-[0.7rem] tracking-[1.2px] uppercase text-[#5a5040] font-semibold mb-[0.45rem]">
                Lot Number
              </label>

              <div className="flex items-stretch gap-[0.5rem]">
                {/* Area */}
                <div className="flex-1 flex flex-col gap-[0.3rem]">
                  <input
                    type="text"
                    placeholder="Area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-[0.75rem] py-[0.65rem] rounded-[8px] border-[1.5px] border-[#ddd8ce] bg-white text-[0.85rem] text-[#1a1a2e] outline-none placeholder:text-[#b0a898] focus:border-[#1a1a2e] transition-colors"
                  />
                  <span className="text-[0.6rem] text-[#8a7e6e] text-center tracking-[0.5px]">
                    Area
                  </span>
                </div>

                <div className="flex items-center pb-[1.3rem]">
                  <span className="text-[#b0a898] font-bold text-lg leading-none">–</span>
                </div>

                {/* Block */}
                <div className="flex-1 flex flex-col gap-[0.3rem]">
                  <input
                    type="text"
                    placeholder="Block"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-[0.75rem] py-[0.65rem] rounded-[8px] border-[1.5px] border-[#ddd8ce] bg-white text-[0.85rem] text-[#1a1a2e] outline-none placeholder:text-[#b0a898] focus:border-[#1a1a2e] transition-colors"
                  />
                  <span className="text-[0.6rem] text-[#8a7e6e] text-center tracking-[0.5px]">
                    Block
                  </span>
                </div>

                <div className="flex items-center pb-[1.3rem]">
                  <span className="text-[#b0a898] font-bold text-lg leading-none">–</span>
                </div>

                {/* Lot No */}
                <div className="flex-1 flex flex-col gap-[0.3rem]">
                  <input
                    type="text"
                    placeholder="Lot No."
                    value={lotNo}
                    onChange={(e) => setLotNo(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-[0.75rem] py-[0.65rem] rounded-[8px] border-[1.5px] border-[#ddd8ce] bg-white text-[0.85rem] text-[#1a1a2e] outline-none placeholder:text-[#b0a898] focus:border-[#1a1a2e] transition-colors"
                  />
                  <span className="text-[0.6rem] text-[#8a7e6e] text-center tracking-[0.5px]">
                    Lot No.
                  </span>
                </div>

                {/* Add Button */}
                <div className="flex flex-col gap-[0.3rem]">
                  <button
                    onClick={handleAdd}
                    disabled={atMax || loading}
                    className={`px-[1rem] py-[0.65rem] rounded-[8px] text-[0.75rem] tracking-[0.8px] uppercase font-semibold transition-all ${atMax || loading
                      ? "bg-[#e8e3da] text-[#b0a898] cursor-not-allowed"
                      : "bg-[#1a1a2e] text-[#d4af6a] hover:bg-[#2d2d4e] hover:-translate-y-[1px] shadow-[0_4px_14px_rgba(26,26,46,0.15)] cursor-pointer"
                      }`}
                  >
                    Check
                  </button>
                  <span className="text-[0.6rem] text-transparent text-center">_</span>
                </div>
              </div>

              {/* Preview */}
              {(area || block || lotNo) && (
                <p className="mt-[0.4rem] text-[0.72rem] text-[#8a7e6e]">
                  Preview:{" "}
                  <span className="font-semibold text-[#1a1a2e]">
                    {[area || "?", block || "?", lotNo || "?"].join("-")}
                  </span>
                </p>
              )}

              {/* Field error */}
              {fieldError && (
                <p className="mt-[0.4rem] text-[0.72rem] text-red-500">
                  {fieldError}
                </p>
              )}
            </div>
          </>
        )}
        {/* Selected Lots List */}
        {pending.length > 0 && (
          <div className="mt-[1.2rem]">
            <div className="flex items-center justify-between mb-[0.5rem]">
              <span className="text-[0.7rem] tracking-[1.2px] uppercase text-[#5a5040] font-semibold">
                Selected Lots
              </span>
              <span className="text-[0.7rem]">
                <span className="text-[#d4af6a] font-bold">
                  {pending.length}
                </span>
                <span className="text-[rgba(0,0,0,0.25)]"> / {MAX_LOTS}</span>
              </span>
            </div>

            <div className="flex flex-col gap-[0.4rem]">
              {pending.map((lot) => (
                <div
                  key={lot.lot_available}
                  className="flex items-center justify-between bg-white border border-[#e0dbd1] rounded-[8px] px-[0.85rem] py-[0.6rem]"
                >
                  <div className="flex items-center gap-[0.6rem]">
                    <div className="w-[7px] h-[7px] rounded-full bg-[#d4af6a] flex-shrink-0" />
                    <span className="text-[0.85rem] font-semibold text-[#1a1a2e]">
                      {lot.lot_available}
                    </span>
                    <span className="text-[0.65rem] bg-[#f0e8d4] text-[#a08c5a] rounded-[4px] px-[0.32rem] py-[0.1rem] uppercase tracking-[0.8px]">
                      {lot.lottype_name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setPending((prev) =>
                        prev.filter((p) => p.lot_available !== lot.lot_available),
                      );

                      sessionStorage.removeItem("confirmedLots");
                      sessionStorage.removeItem("assignedTerms");
                      sessionStorage.removeItem("lotInputs");
                      sessionStorage.removeItem("pricing");
                      sessionStorage.removeItem("selectedLots");
                    }}
                    className="text-[#b0a898] hover:text-red-400 text-[0.75rem] transition-colors ml-[0.5rem]"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-[1rem] px-[1.75rem] py-[0.9rem] border-t border-[#e8e3da] bg-[#f5f1eb] flex-shrink-0">
        <button
          className="flex items-center gap-[0.25rem] px-[1.3rem] py-[0.65rem] rounded-[8px] border-[1.5px] border-[#ddd8ce] text-[0.75rem] tracking-[0.8px] uppercase text-[#5a5040] bg-transparent transition-all hover:border-[#1a1a2e] hover:text-[#1a1a2e]"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          className={`flex items-center gap-[0.5rem] px-[1.5rem] py-[0.7rem] rounded-[8px] text-xs tracking-[1px] uppercase transition-all ${pending.length > 0 && !loading
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
      </div>
    </>
  );
}