const About = () => {
    return (
        <div className="py-20 px-4 max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-black text-brand-primary mb-8 tracking-tighter uppercase italic shadow-brand-accent/5">
                OUR <span className="text-brand-accent">KITCHEN</span>
            </h1>
            <p className="text-xl text-brand-primary/70 leading-relaxed font-medium mb-12 max-w-2xl mx-auto">
                We believe that the best moments in life happen around the kitchen table. Our mission is to provide you with the finest tools and insights to create unforgettable culinary experiences.
            </p>
            <div className="bg-brand-primary p-12 rounded-[48px] border border-brand-primary/10 shadow-2xl shadow-brand-primary/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-accent/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <h2 className="text-3xl font-black text-brand-bg mb-6 italic tracking-tight relative z-10 transition-colors group-hover:text-brand-accent">OUR COMMITMENT</h2>
                <p className="text-brand-bg/70 font-black tracking-[0.3em] text-sm uppercase relative z-10 group-hover:text-brand-bg transition-colors">
                    Quality. Sustainability. Passion.
                </p>
            </div>
        </div>
    );
};

export default About;
