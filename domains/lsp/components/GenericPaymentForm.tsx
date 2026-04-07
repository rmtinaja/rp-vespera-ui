import { File, Notebook, User, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PaymentService } from "../Services/PaymentService";
import imageCompression from "browser-image-compression";
import { SubmitPaymentDTO, SubmitPaymentLotDTO } from "../DTO/SubmitPaymentDTO";

interface Props {
  nextPage: () => void;
}
export default function GenericPaymentComponent({ nextPage }: Props) {
    const [verified, setVerified] = useState(false);
    const [firstname, setFirstname] = useState("");
    const [middlename, setMiddlename] = useState("");
    const [lastname, setLastname] = useState("");
    const [loading, setLoading] = useState(false);

    // LSP STATES
    const [lots, setLots] = useState<any[]>([]);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [allocations, setAllocations] = useState<Record<string, number>>({});
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [referenceNumber, setReferenceNumber] = useState("");
    const [accountNumber, setaccountNumber] = useState("");
    const [dateDeposited, setDateDeposited] = useState("");
    const [notes, setNotes] = useState("");

    const [aiReading, setAiReading] = useState(false);
    const handleVerify = async (e: any) => {
        e.preventDefault();

        try {
        setLoading(true);

        const result = await PaymentService.verifyGenericName({
            firstname,
            middlename: middlename || null,
            lastname,
        });

        sessionStorage.setItem(
            "verifiedCustomer",
            JSON.stringify(result)
        );

        setVerified(true);
        } catch (error) {
        console.error(error);
        alert("Verification failed");
        setVerified(false);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        if (!verified) return;
        const stored = sessionStorage.getItem("verifiedCustomer");
        if (!stored) return;
        const parsed = JSON.parse(stored);
        setLots(parsed?.data?.lots || []);
    }, [verified]);
    useEffect(() => {
        if (lots.length === 0 || paymentAmount <= 0) return;
        const baseShare = Math.floor((paymentAmount / lots.length) * 100) / 100;

        let distributed = 0;
        const newAllocations: Record<string, number> = {};

        lots.forEach((lot, index) => {
        const key = `${lot.mp_i_lot_id}-${index}`;

        if (index === lots.length - 1) {
            newAllocations[key] = parseFloat(
                (paymentAmount - distributed).toFixed(2)
            );
        } else {
            newAllocations[key] = baseShare;
            distributed += baseShare;
        }
        });

        setAllocations(newAllocations);
    }, [paymentAmount, lots]);
    const handleReadReceipt = async (file: File) => {
        try {
            setAiReading(true);

            const formData = new FormData();
            formData.append("receipt", file);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/read-receipt`,
                {
                method: "POST",
                body: formData,
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to process receipt");
            }

            if (result.success) {
                setReferenceNumber(result.referenceNumber || "");
                setaccountNumber(result.accountNumber || "");
                setDateDeposited(result.date_deposited || "");
                setPaymentAmount(Number(result.amount) || 0);
            } else {
                alert(result.error || "AI extraction failed");
            }
        } catch (error: any) {
            console.error("AI ERROR:", error);
            alert(error.message);
        } finally {
            setAiReading(false);
        }
    };
    const handleFileChange = async (file: File) => {
        try {
            const compressed = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
            });
            setReceiptFile(compressed);
            await handleReadReceipt(compressed);

        } catch (error) {
            console.error("Compression error:", error);
        }
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            setLoading(true);

            if (!receiptFile) return alert("Upload receipt");
            if (paymentAmount <= 0) return alert("Invalid amount");
            if (!referenceNumber) return alert("Reference required");
            if (lots.length === 0) return alert("No lots found");

            const stored = sessionStorage.getItem("verifiedCustomer");
            const parsed = stored ? JSON.parse(stored) : null;

            const customer = parsed?.data?.customer;

            if (!customer) {
                alert("Missing customer data");
                return;
            }
            const phone = customer.phone;
            const name = customer.name1;
            const ownerId = customer.mp_i_owner_id;
            const formattedLots = lots.reduce<SubmitPaymentLotDTO[]>((acc, lot: any, index: number) => {
                const key = `${lot.mp_i_lot_id}-${index}`;
                const amount = allocations[key] || 0;

                if (amount > 0) {
                    acc.push({
                        mp_i_lot_id: lot.mp_i_lot_id,
                        amount,
                        lot_number: lot.lot,
                    });
                }

                return acc;
            }, []);

            if (formattedLots.length === 0) {
                alert("No valid allocations");
                return;
            }

            const dto :SubmitPaymentDTO = {
                phone_number: phone,
                mp_i_owner_id: ownerId,
                mp_t_purchagr_id: lots[0]?.mp_t_purchagr_id,
                reference_number: referenceNumber,
                accountNumber: accountNumber,
                cnc_sales_incharge: "WEB",
                attachment: receiptFile,
                lots: formattedLots,
                notes,
                name,
                date_deposited: dateDeposited,
            };

            const result = await PaymentService.submitPayment(dto, false);

            if (result.success) {
                const again = confirm("Payment submitted successfully!\n\nDo you want to make another payment?");

                if (again) {
                    setVerified(false);
                    setFirstname("");
                    setMiddlename("");
                    setLastname("");
                    setLots([]);
                    setPaymentAmount(0);
                    setAllocations({});
                    setReceiptFile(null);
                    setReferenceNumber("");
                    setDateDeposited("");
                    setNotes("");
                    sessionStorage.removeItem("verifiedCustomer");
                } else {
                    if (typeof nextPage === "function") {
                        nextPage();
                    }
                }
            } 
            else {
                alert(result.message || "Submission failed.");
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {!verified && (
                <form onSubmit={handleVerify}>
                    <div className="field-container">
                        <label htmlFor="">
                            First Name
                        </label>
                        <div className="input-text-container">
                            <User/>
                            <input className="input-field" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="First Name" />
                        </div>
                    </div>
                    <div className="field-container">
                        <label htmlFor="">
                            Middle Name
                        </label>
                        <div className="input-text-container">
                            <User/>
                            <input className="input-field" value={middlename} onChange={(e) => setMiddlename(e.target.value)} placeholder="Middle Name" />
                        </div>
                    </div>
                    <div className="field-container">
                        <label htmlFor="">
                            Last Name
                        </label>
                        <div className="input-text-container">
                            <User/>
                            <input className="input-field" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Last Name" />
                        </div>
                    </div>
                    
                    
                    
                    <button disabled={loading} className="bg-accent-rp w-full mt-2">
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                </form>
            )}

            {verified && (
                <form onSubmit={handleSubmit}>
                    <div className="field-container">
                        <label htmlFor="">Upload Receipt</label>
                        <div className="input-text-container">
                            <File></File>
                            <input type="file" className="input-field" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileChange(file);}}/>
                        </div>
                        {aiReading && <p>Reading Receipt Please Wait</p>}
                    </div>
                    <div className="field-container">
                        <label htmlFor="">Reference Number</label>
                        <div className="input-text-container">
                            <File></File>
                            <input type="text" placeholder="Reference Number" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} disabled/>
                        </div>
                        {aiReading && <p>Reading Receipt Please Wait</p>}
                    </div>
                    <div className="field-container">
                        <label htmlFor="">Payment Amount</label>
                        <div className="input-text-container">
                            <File></File>
                            <input type="number" placeholder="Payment Amount" value={paymentAmount || ""} onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)} disabled/>
                        </div>
                        {aiReading && <p>Reading Receipt Please Wait</p>}
                    </div>
                    <div className="field-container">
                        <label htmlFor="">Notes</label>
                        <textarea className="text-field" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)}/>
                    </div>
                    <button disabled={loading} className="bg-accent-rp w-full mt-3">
                        {loading ? "Submitting..." : "Submit Payment"}
                    </button>

                </form>
            )}
        </div>
    );
}