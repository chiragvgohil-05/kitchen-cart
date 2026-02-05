import { HelpCircle, ChevronRight } from "lucide-react";

const Faqs = () => {
    const faqData = [
        {
            q: "How do I care for my stainless steel knives?",
            a: "We recommend hand-washing with mild soap and immediate drying to maintain the edge and finish. Avoid dishwashers as high heat and chemicals can dull the blade over time."
        },
        {
            q: "Do you offer professional sharpening?",
            a: "Yes, we provide one complimentary professional sharpening service within the first year for all our premium knife sets. Contact our support to arrange a pickup."
        },
        {
            q: "Are the induction hobs compatible with all cookware?",
            a: "Induction hobs require magnetic base cookware (cast iron or magnetic stainless steel). You can test your existing pans with a simple magnet!"
        },
        {
            q: "What is your warranty period?",
            a: "Our appliances come with a 2-year comprehensive warranty, while our professional cutlery collection features a limited lifetime warranty on manufacturing defects."
        }
    ];

    return (
        <div className="bg-brand-bg min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto space-y-20">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-brand-primary text-brand-accent rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-brand-primary/20 rotate-45">
                        <HelpCircle size={40} className="-rotate-45" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-brand-primary tracking-tighter uppercase">Frequently <br /><span className="text-brand-accent italic">Asked</span></h1>
                    <p className="text-brand-primary/60 font-medium max-w-lg mx-auto">Everything you need to know about our products and services.</p>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, i) => (
                        <details key={i} className="group bg-white rounded-[32px] border border-brand-primary/5 shadow-sm overflow-hidden transition-all">
                            <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                                <h3 className="text-xl font-black tracking-tight text-brand-primary max-w-[80%]">{item.q}</h3>
                                <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center text-brand-primary/20 group-open:rotate-90 group-open:bg-brand-accent group-open:text-brand-primary transition-all">
                                    <ChevronRight size={20} />
                                </div>
                            </summary>
                            <div className="px-8 pb-8 text-brand-primary/60 font-medium leading-relaxed border-t border-brand-primary/5 pt-6 animate-in fade-in slide-in-from-top-2">
                                {item.a}
                            </div>
                        </details>
                    ))}
                </div>

                <div className="text-center space-y-8">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Still have questions?</h2>
                    <button className="px-12 py-5 bg-brand-primary text-brand-bg rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-accent hover:text-brand-primary transition-all shadow-xl shadow-brand-primary/20">Contact Expertise</button>
                </div>
            </div>
        </div>
    );
};

export default Faqs;
