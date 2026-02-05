import { Truck, Globe, ShieldCheck, Zap } from "lucide-react";

const Shipping = () => {
    const methods = [
        {
            icon: <Zap size={32} />,
            title: "Standard Express",
            time: "3-5 Business Days",
            cost: "₹150 (Free over ₹5,000)",
            desc: "The reliable choice for your everyday culinary needs."
        },
        {
            icon: <Globe size={32} />,
            title: "Priority Air",
            time: "1-2 Business Days",
            cost: "₹450",
            desc: "When you need your tools ready for the next meal."
        }
    ];

    return (
        <div className="bg-brand-bg min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto space-y-20">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-brand-primary text-brand-accent rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-brand-primary/20 rotate-12">
                        <Truck size={40} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-brand-primary tracking-tighter uppercase">Shipping <br /><span className="text-brand-accent italic">Policy</span></h1>
                    <p className="text-brand-primary/60 font-medium max-w-lg mx-auto">We take pride in our packaging and delivery. Every precision tool is handled with care from our workshop to your doorstep.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {methods.map((m, i) => (
                        <div key={i} className="bg-white p-10 rounded-[48px] border border-brand-primary/5 shadow-sm hover:shadow-2xl hover:shadow-brand-primary/5 transition-all space-y-6">
                            <div className="text-brand-accent">{m.icon}</div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black tracking-tight">{m.title}</h3>
                                <p className="text-brand-accent font-black text-[10px] uppercase tracking-widest">{m.time}</p>
                            </div>
                            <p className="text-brand-primary/60 font-medium">{m.desc}</p>
                            <div className="pt-4 border-t border-brand-primary/5 font-black text-brand-primary">{m.cost}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-12 rounded-[48px] border border-brand-primary/5 space-y-8">
                    <div className="flex items-center gap-4 text-brand-accent">
                        <ShieldCheck size={24} />
                        <h2 className="text-2xl font-black uppercase tracking-tight text-brand-primary">Delivery Protection</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-brand-primary/70 leading-relaxed font-medium">
                        <p>All our shipments are insured against damage or loss. If your product arrives in anything less than perfect condition, we will replace it immediately at no extra cost to you.</p>
                        <p>We use eco-friendly, biodegradable padding and high-strength reinforced boxes to ensure your professional tools remain sharp and pristine during transit.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
