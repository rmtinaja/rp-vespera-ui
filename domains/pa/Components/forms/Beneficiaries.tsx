import { useState } from "react";

type Beneficiary = {
  firstName: string;
  middleName: string;
  lastName: string;
};

type BeneficiariesProps = {
  initialBeneficiaries?: Beneficiary[];
  setDialogOpen: (open: boolean) => void;
  setActiveDialog: (dialog: number | null) => void;
  onSave?: (beneficiaries: Beneficiary[]) => void;
};

export default function Beneficiaries({
  initialBeneficiaries = [],
  setDialogOpen,
  setActiveDialog,
  onSave,
}: BeneficiariesProps) {
  const [beneficiaries, setBeneficiaries] =
    useState<Beneficiary[]>(initialBeneficiaries);

  const handleSave = () => {
    // Check if all beneficiaries have first and last names safely
    const invalid = beneficiaries.some(
      (b) => !b?.firstName?.trim() || !b?.lastName?.trim(),
    );

    if (invalid) {
      alert("Please fill in both first and last names for all beneficiaries.");
      return;
    }

    if (onSave) {
      onSave(beneficiaries);
    }
    setDialogOpen(false);
    setActiveDialog(null);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-[#d6d3d1] shadow-xl w-full max-w-[560px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e3da] bg-[#f5f1eb]">
          <h2 className="font-serif text-lg font-medium text-[#060503]">
            Beneficiary Information
          </h2>
          <button
            onClick={() => {
              setDialogOpen(false);
              setActiveDialog(null);
            }}
            className="text-[#9a9a9a] hover:text-[#060503] text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {beneficiaries.map((b, index) => (
            <div
              key={index}
              className="mb-4 border border-[#e8e3da] p-4 rounded-lg bg-[#f9f9f7]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[0.75rem] tracking-[1px] uppercase text-[#9a9a9a] font-semibold">
                  Beneficiary {index + 1}
                </span>
                <button
                  onClick={() =>
                    setBeneficiaries(
                      beneficiaries.filter((_, i) => i !== index),
                    )
                  }
                  className="text-[#c0b9ae] hover:text-red-400 text-sm transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Name Fields */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-3 py-2 border border-[#d6d3d1] rounded-lg text-sm text-[#060503] outline-none focus:border-[#060503] transition-colors"
                  value={b.firstName}
                  onChange={(e) => {
                    const newB = [...beneficiaries];
                    newB[index].firstName = e.target.value;
                    setBeneficiaries(newB);
                  }}
                />
                <input
                  type="text"
                  placeholder="Middle Name"
                  className="w-full px-3 py-2 border border-[#d6d3d1] rounded-lg text-sm text-[#060503] outline-none focus:border-[#060503] transition-colors"
                  value={b.middleName}
                  onChange={(e) => {
                    const newB = [...beneficiaries];
                    newB[index].middleName = e.target.value;
                    setBeneficiaries(newB);
                  }}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-3 py-2 border border-[#d6d3d1] rounded-lg text-sm text-[#060503] outline-none focus:border-[#060503] transition-colors"
                  value={b.lastName}
                  onChange={(e) => {
                    const newB = [...beneficiaries];
                    newB[index].lastName = e.target.value;
                    setBeneficiaries(newB);
                  }}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            className={`w-full py-2.5 border-[1.5px] border-dashed rounded-lg text-sm transition-colors ${
              beneficiaries.length < 2
                ? "border-[#d6d3d1] text-[#9a9a9a] hover:border-[#b28648] hover:text-[#b28648]"
                : "border-[#e8e3da] text-[#b0a898] cursor-not-allowed"
            }`}
            onClick={() => {
              if (beneficiaries.length >= 2) return;
              setBeneficiaries([
                ...beneficiaries,
                { firstName: "", middleName: "", lastName: "" },
              ]);
            }}
          >
            + Add Beneficiary
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e8e3da] bg-[#f5f1eb]">
          <button
            className="px-5 py-2.5 rounded-lg border-[1.5px] border-[#d6d3d1] text-sm text-[#5a5040] hover:border-[#060503] hover:text-[#060503] transition-all"
            onClick={() => {
              setDialogOpen(false);
              setActiveDialog(null);
            }}
          >
            Cancel
          </button>
          <button
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm tracking-[0.5px] transition-all ${
              beneficiaries.length > 0
                ? "bg-[#060503] text-[#b28648] hover:bg-[#1a1a1a] shadow-md cursor-pointer"
                : "bg-[#e8e3da] text-[#b0a898] cursor-not-allowed"
            }`}
            disabled={beneficiaries.length === 0}
            onClick={handleSave}
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
