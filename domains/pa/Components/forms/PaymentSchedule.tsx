import { useState } from "react";

type PaymentSchedule = {
  scheduleId: string;
  paymentDay: number;
};

type Props = {
  initialSchedule: PaymentSchedule | null;
  paymentTerms: {
    id: string;
    label: string;
    sublabel: string;
    months: number;
  }[];
  confirmedLots: {
    lottype_name: string;
    lot_available: string;
    term_id: string;
  }[];
  onSave: (schedule: PaymentSchedule) => void;
  onClose: () => void;
};

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function PaymentSchedule({
  initialSchedule,
  onSave,
  onClose,
}: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(
    initialSchedule?.paymentDay ?? null,
  );
  function formatLocalDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function handleSave() {
    if (selectedDay === null) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    let selectedDate = new Date(year, month, selectedDay);

    // Adjust if day exceeds month length
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    if (selectedDate.getDate() > lastDayOfMonth) {
      selectedDate.setDate(lastDayOfMonth);
    }

    const schedule = {
      scheduleId: crypto.randomUUID(),
      paymentDay: selectedDate.getDate(),
      fullDate: formatLocalDate(selectedDate), // local date string
    };

    sessionStorage.setItem("paymentSchedule", JSON.stringify(schedule));
    onSave(schedule);
  }
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-[#d6d3d1] shadow-xl w-full max-w-[480px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e3da] bg-[#f5f1eb]">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#060503]">
              Payment Schedule
            </h2>
            <p className="text-[0.75rem] text-[#9a9a9a] mt-[1px]">
              Select the day of each month for payment
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9a9a9a] hover:text-[#060503] text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Day grid */}
          <div className="grid grid-cols-7 gap-[4px]">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isSel = selectedDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square flex items-center justify-center text-[13px] rounded-[8px] border-[0.5px] transition-all
                    ${
                      isSel
                        ? "bg-[#060503] text-white border-transparent font-medium"
                        : "bg-white text-[#060503] border-[#d6d3d1] hover:bg-[#f5f1eb] hover:border-[#9a9a9a]"
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Selected summary */}
          {selectedDay !== null && (
            <div className="mt-4 flex items-center justify-between px-4 py-3 bg-[#f5f1eb] rounded-[8px]">
              <span className="text-[13px] text-[#9a9a9a]">Payment every</span>
              <span className="text-[13px] font-medium text-[#060503]">
                {ordinal(selectedDay)} of each month
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e8e3da] bg-[#f5f1eb]">
          <button
            className="px-5 py-2.5 rounded-lg border-[1.5px] border-[#d6d3d1] text-sm text-[#5a5040] hover:border-[#060503] hover:text-[#060503] transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={selectedDay === null}
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm tracking-[0.5px] transition-all ${
              selectedDay !== null
                ? "bg-[#060503] text-[#b28648] hover:bg-[#1a1a1a] shadow-md cursor-pointer"
                : "bg-[#e8e3da] text-[#b0a898] cursor-not-allowed"
            }`}
          >
            Save
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
    </div>
  );
}
