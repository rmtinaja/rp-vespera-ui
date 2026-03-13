interface ModalComponentProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function ModalComponent({ isOpen, onClose, title, children }: ModalComponentProps) 
{
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div
                className="bg-white rounded-xl p-6 shadow-lg relative w-1/3 border-x-4 border-[#00303a]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg">
                        {title}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}