import { Truck, Globe, ShieldCheck, Zap } from "lucide-react";

const Shipping = () => {
    const methods = [
        {
            icon: <Zap size={32} strokeWidth={1} />,
            title: "STORE EXPEDITE",
            time: "3-5 RITUAL CYCLES",
            cost: "₹150 (FREE OVER ₹5,000)",
            desc: "Standard delivery for your everyday essentials."
        },
        {
            icon: <Globe size={32} strokeWidth={1} />,
            title: "SUPREME WHISPER",
            time: "1-2 RITUAL CYCLES",
            cost: "₹450",
            desc: "When the harvest cannot wait. A priority channel for the faithful."
        }
    ];

    return (
        <div className="bg-cream min-h-screen py-32 px-6 sm:px-8 lg:px-6 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-24">
                <div className="text-center space-y-8">
                    <div className="w-24 h-24 bg-coffee-brown text-accent-gold rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-coffee-brown/20 rotate-12 transform hover:rotate-0 transition-transform duration-700 cursor-default">
                        <Truck size={48} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-coffee-brown tracking-tighter leading-[0.85]">HARVEST <br /><span className="text-accent-gold not-">DISPATCH</span></h1>
                        <p className="text-sm font-bold text-coffee-brown/30 tracking-wide max-w-lg mx-auto leading-relaxed">Your selection is carefully packaged and shipped to your doorstep.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {methods.map((m, i) => (
                        <div key={i} className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 hover:border-accent-gold transition-all duration-700 space-y-10 group">
                            <div className="text-accent-gold transform group-hover:scale-110 transition-transform duration-500">{m.icon}</div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-bold text-coffee-brown tracking-tighter">{m.title}</h3>
                                <p className="text-accent-gold font-bold text-sm tracking-wide">{m.time}</p>
                            </div>
                            <p className="text-sm font-bold text-coffee-brown/40 tracking-wide leading-loose">{m.desc}</p>
                            <div className="pt-8 border-t border-coffee-brown/5 font-bold text-coffee-brown text-[12px] tracking-widest">{m.cost}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 space-y-12">
                    <div className="flex items-center gap-6 text-accent-gold">
                        <ShieldCheck size={32} strokeWidth={1} />
                        <h2 className="text-2xl font-bold tracking-tighter text-coffee-brown leading-none">VINTAGE PROTECTION</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-bold tracking-wide text-coffee-brown/40 leading-loose">
                        <p>All shipments are insured. If your order arrives damaged, we will replace it immediately at no cost.</p>
                        <p>We use biodegradable packaging and reinforced materials to ensure your products arrive in perfect condition.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
