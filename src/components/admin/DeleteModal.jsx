import { Trash2, X, AlertCircle } from "lucide-react";

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brand-primary/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-brand-primary transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                        <Trash2 size={32} />
                    </div>

                    <h2 className="text-2xl font-black text-brand-primary tracking-tight mb-2 uppercase">Delete Product</h2>
                    <p className="text-brand-primary/60 font-medium">
                        Are you sure you want to delete <span className="text-brand-primary font-black">"{itemName}"</span>? This action cannot be undone.
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full mt-8">
                        <button
                            onClick={onClose}
                            className="py-4 bg-brand-bg text-brand-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
