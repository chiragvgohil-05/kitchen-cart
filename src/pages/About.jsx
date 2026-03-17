const About = () => {
    return (
        <div className="bg-cream min-h-screen py-32 px-6 sm:px-8 lg:px-6 animate-fade-in">
            <div className="max-w-4xl mx-auto text-center space-y-16">
                <div className="space-y-8">
                    <div className="h-2 w-24 bg-accent-gold mx-auto rounded-full" />
                    <h1 className="text-4xl lg:text-9xl font-bold text-coffee-brown tracking-tighter leading-none">
                        OUR <br /><span className="text-accent-gold not-">PHILOSOPHY</span>
                    </h1>
                    <p className="text-sm font-bold text-coffee-brown/30 tracking-[0.5em]">Our Philosophy</p>
                </div>
                
                <p className="text-2xl text-coffee-brown/60 leading-relaxed font-bold max-w-3xl mx-auto">
                    "We believe in delivering the best quality products to our customers. Our mission is to provide you with an exceptional shopping experience."
                </p>

                <div className="grid md:grid-cols-3 gap-8 pt-12">
                    {[
                        { title: "ORIGIN", desc: "Sourced directly from the best farms." },
                        { title: "QUALITY", desc: "Crafted with care and precision." },
                        { title: "LEGACY", desc: "A commitment to excellence." }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 group hover:-translate-y-2 transition-transform duration-500">
                            <h3 className="text-sm font-bold text-accent-gold tracking-wide mb-4">{item.title}</h3>
                            <p className="text-xs font-bold text-coffee-brown/40 tracking-widest leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-coffee-brown p-8 lg:p-24 rounded-[80px] border border-coffee-brown shadow-2xl shadow-coffee-brown/20 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    <h2 className="text-2xl lg:text-3xl font-bold text-cream mb-8 tracking-tighter relative z-10 transition-colors group-hover:text-accent-gold">THE COMMITMENT</h2>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 relative z-10">
                        <div className="text-cream/40 font-bold tracking-wide text-xs">Elegance</div>
                        <div className="w-1.5 h-1.5 bg-accent-gold rounded-full" />
                        <div className="text-cream/40 font-bold tracking-wide text-xs">Precision</div>
                        <div className="w-1.5 h-1.5 bg-accent-gold rounded-full" />
                        <div className="text-cream/40 font-bold tracking-wide text-xs">Transcendence</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
