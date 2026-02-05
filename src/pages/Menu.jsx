const Menu = () => {
    return (
        <div className="py-16 px-4 max-w-7xl mx-auto">
            <h1 className="text-5xl font-black text-brand-primary mb-8 border-b-8 border-brand-accent inline-block pb-2 tracking-tighter">OUR COLLECTION</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="bg-brand-bg rounded-3xl shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-300 border border-brand-primary/5 group">
                        <div className="h-48 bg-brand-primary/10 overflow-hidden relative">
                            <div className="absolute inset-0 bg-brand-primary/5 group-hover:bg-brand-primary/0 transition-colors duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center text-brand-primary/10 font-black text-6xl">ITEM</div>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-black text-brand-primary leading-tight">Exquisite Artisan <br />Tool #{item}</h3>
                                <span className="text-brand-accent text-xs font-black tracking-widest uppercase bg-brand-accent/10 px-2 py-1 rounded">New</span>
                            </div>
                            <p className="text-brand-primary/60 mb-8 text-sm font-medium">A perfect blend of high-grade steel and master craftsmanship.</p>
                            <div className="flex justify-between items-center bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/5">
                                <span className="text-2xl font-black text-brand-primary tracking-tighter">$24.99</span>
                                <button className="px-6 py-2.5 bg-brand-primary text-brand-bg rounded-xl font-bold text-xs hover:bg-brand-accent hover:text-brand-primary transition-all uppercase tracking-widest">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
