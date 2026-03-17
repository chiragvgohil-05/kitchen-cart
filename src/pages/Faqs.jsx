import { HelpCircle, ChevronRight } from "lucide-react";

const Faqs = () => {
    const faqData = [
        {
            q: "What makes your products special?",
            a: "Our products are sourced from the best locations and carefully selected for quality."
        },
        {
            q: "Do you provide brewing guides?",
            a: "Yes, we provide detailed guides for all our products."
        },
        {
            q: "How should I store my products?",
            a: "Store them in a cool, dark place away from direct sunlight."
        },
        {
            q: "Do you have a rewards program?",
            a: "Yes, you can earn points on every purchase and redeem them for discounts and special items."
        }
    ];

    return (
        <div className="bg-cream min-h-screen py-32 px-6 sm:px-8 lg:px-6 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-24">
                <div className="text-center space-y-8">
                    <div className="w-24 h-24 bg-coffee-brown text-accent-gold rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-coffee-brown/20 rotate-12 transform hover:rotate-0 transition-transform duration-700 cursor-default">
                        <HelpCircle size={48} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-coffee-brown tracking-tighter leading-[0.85]">
                            FREQUENTLY ASKED <br /><span className="text-accent-gold not-">QUESTIONS</span>
                        </h1>
                        <p className="text-sm font-bold text-coffee-brown/30 tracking-wide max-w-sm mx-auto leading-relaxed">Everything you need to know about our products and services.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {faqData.map((item, i) => (
                        <details key={i} className="group bg-white/40 backdrop-blur-xl rounded-[48px] border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 overflow-hidden transition-all duration-700">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none focus:outline-none">
                                <h3 className="text-xl font-bold tracking-tight text-coffee-brown max-w-[80%]">{item.q}</h3>
                                <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-coffee-brown/20 group-open:rotate-90 group-open:bg-accent-gold group-open:text-white transition-all duration-500 shadow-inner">
                                    <ChevronRight size={24} />
                                </div>
                            </summary>
                            <div className="px-6 pb-10 text-sm font-medium text-coffee-brown/70 leading-loose border-t border-coffee-brown/5 pt-8 animate-fade-in">
                                {item.a}
                            </div>
                        </details>
                    ))}
                </div>

                <div className="text-center space-y-10 pt-12">
                    <h2 className="text-sm font-bold tracking-[0.5em] text-coffee-brown/30">Still have questions?</h2>
                    <button className="px-16 py-6 bg-coffee-brown text-white rounded-full font-bold text-sm tracking-wide hover:bg-accent-gold transition-all shadow-2xl shadow-coffee-brown/20 transform hover:-translate-y-1">Contact Support</button>
                </div>
            </div>
        </div>
    );
};

export default Faqs;
