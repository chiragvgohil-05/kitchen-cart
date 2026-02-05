import { RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";

const Returns = () => {
    return (
        <div className="bg-brand-bg min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto space-y-20">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-brand-primary text-brand-accent rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-brand-primary/20 -rotate-12">
                        <RotateCcw size={40} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-brand-primary tracking-tighter uppercase">Returns <br /><span className="text-brand-accent italic">& Refund</span></h1>
                    <p className="text-brand-primary/60 font-medium max-w-lg mx-auto">Not thrilled with your tool? We offer a hassle-free 30-day return policy for all our premium kitchenware.</p>
                </div>

                <div className="space-y-6">
                    {[
                        { title: "30-Day Window", desc: "Items must be returned within 30 days of delivery receipt." },
                        { title: "Original Packaging", desc: "Please keep all original boxes and certificates for a smooth return process." },
                        { title: "Condition", desc: "To be eligible, items must be unused and in the same condition that you received them." }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-[32px] border border-brand-primary/5 shadow-sm flex items-start gap-6 group hover:border-brand-accent transition-all">
                            <div className="w-12 h-12 bg-brand-bg rounded-2xl flex items-center justify-center text-brand-accent shrink-0 group-hover:bg-brand-accent group-hover:text-brand-primary transition-colors">
                                <CheckCircle2 size={24} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black">{item.title}</h3>
                                <p className="text-brand-primary/60 font-medium">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-red-50 p-12 rounded-[48px] border border-red-100 flex flex-col md:flex-row items-center gap-8">
                    <AlertCircle size={48} className="text-red-500 shrink-0" />
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-2xl font-black text-red-900 tracking-tight">Need help right now?</h2>
                        <p className="text-red-700/70 font-medium">Contact our returns concierge at <span className="font-black">returns@kitchencart.com</span> for immediate assistance with your request.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Returns;
