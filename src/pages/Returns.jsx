import { RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";

const Returns = () => {
    return (
        <div className="bg-cream min-h-screen py-32 px-6 sm:px-8 lg:px-6 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-24">
                <div className="text-center space-y-8">
                    <div className="w-24 h-24 bg-coffee-brown text-accent-gold rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-coffee-brown/20 -rotate-12 transform hover:rotate-0 transition-transform duration-700 cursor-default">
                        <RotateCcw size={48} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-coffee-brown tracking-tighter leading-[0.85]">EASY <br /><span className="text-accent-gold not-">RETURNS</span></h1>
                        <p className="text-sm font-bold text-coffee-brown/30 tracking-wide max-w-lg mx-auto leading-relaxed">If you are not satisfied with your purchase, you can return it easily.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {[
                        { title: "30-DAY WINDOW", desc: "Returns must be initiated within 30 days of receiving your order." },
                        { title: "ORIGINAL PACKAGING", desc: "Keep all original packaging for a seamless return process." },
                        { title: "UNUSED ITEMS", desc: "Items must be returned in their original, unused condition." }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/40 backdrop-blur-xl p-6 rounded-[48px] border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 flex items-start gap-8 group hover:border-accent-gold transition-all duration-700">
                            <div className="w-16 h-16 bg-cream rounded-[24px] flex items-center justify-center text-accent-gold shrink-0 group-hover:bg-coffee-brown group-hover:text-white transition-all duration-500 shadow-inner">
                                <CheckCircle2 size={32} strokeWidth={1} />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-coffee-brown tracking-tight">{item.title}</h3>
                                <p className="text-sm font-bold text-coffee-brown/40 tracking-wide leading-loose">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-coffee-brown p-8 rounded-3xl shadow-2xl shadow-coffee-brown/20 flex flex-col md:flex-row items-center gap-6 text-center md:text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <AlertCircle size={64} strokeWidth={1} className="text-accent-gold shrink-0 relative z-10" />
                    <div className="space-y-4 relative z-10">
                        <h2 className="text-2xl font-bold text-white tracking-tighter">Seeking Immediate Guidance?</h2>
                        <p className="text-white/60 text-sm font-bold tracking-wide leading-relaxed">Contact us at <span className="text-accent-gold border-b border-accent-gold/30 pb-1">support@example.com</span> for professional assistance with your request.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Returns;
