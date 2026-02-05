import {
    Package,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit3,
    Trash2,
    ExternalLink
} from "lucide-react";

const Products = () => {
    const products = [
        { id: 1, name: "Professional Chef Knife", category: "Cutlery", price: 129.00, stock: 15, status: "Active" },
        { id: 2, name: "Non-Stick Skillet", category: "Cookware", price: 85.00, stock: 42, status: "Active" },
        { id: 3, name: "Spices Carousel", category: "Storage", price: 45.99, stock: 8, status: "Low Stock" },
        { id: 4, name: "Electric Mixer", category: "Appliances", price: 299.00, stock: 24, status: "Active" },
        { id: 5, name: "Apron & Glove Set", category: "Textiles", price: 35.00, stock: 0, status: "Out of Stock" },
    ];

    return (
        <div className="space-y-8 text-brand-primary">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Inventory Archive</h1>
                    <p className="text-brand-primary/60 font-bold text-sm">Managing the structural units of the kitchen.</p>
                </div>
                <button className="flex items-center justify-center gap-3 px-8 py-5 bg-brand-primary text-brand-bg rounded-2xl font-black text-xs hover:bg-brand-accent hover:text-brand-primary transition-all shadow-xl shadow-brand-primary/10 uppercase tracking-widest">
                    <Plus size={18} strokeWidth={3} />
                    Append Unit
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-brand-bg p-6 rounded-[32px] border border-brand-primary/10 shadow-sm flex flex-col lg:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/30" size={18} />
                    <input
                        type="text"
                        placeholder="Search index by signature..."
                        className="w-full pl-12 pr-4 py-4 bg-brand-primary/5 border-none rounded-2xl text-xs focus:ring-2 focus:ring-brand-accent/20 font-black placeholder:text-brand-primary/20 uppercase tracking-widest"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary/5 text-brand-primary rounded-2xl font-black text-xs hover:bg-brand-primary/10 transition-all border border-brand-primary/10 uppercase tracking-widest">
                        <Filter size={18} />
                        Filters
                    </button>
                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary/5 text-brand-primary rounded-2xl font-black text-xs hover:bg-brand-primary/10 transition-all border border-brand-primary/10 text-nowrap uppercase tracking-widest">
                        Exp. Data
                    </button>
                </div>
            </div>

            {/* Products UI */}
            <div className="bg-brand-bg rounded-[40px] shadow-sm border border-brand-primary/10 overflow-hidden mb-12">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-primary/5 border-b border-brand-primary/10">
                                <th className="p-8 font-black text-brand-primary/40 text-[10px] uppercase tracking-[0.3em]">Signature</th>
                                <th className="p-8 font-black text-brand-primary/40 text-[10px] uppercase tracking-[0.3em]">Classification</th>
                                <th className="p-8 font-black text-brand-primary/40 text-[10px] uppercase tracking-[0.3em]">Valuation</th>
                                <th className="p-8 font-black text-brand-primary/40 text-[10px] uppercase tracking-[0.3em]">Status</th>
                                <th className="p-8 font-black text-brand-primary/40 text-[10px] uppercase tracking-[0.3em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-b border-brand-primary/5 hover:bg-brand-primary/5 transition-colors group">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-brand-primary text-brand-bg rounded-2xl flex items-center justify-center group-hover:bg-brand-accent group-hover:text-brand-primary transition-all duration-300 shadow-md">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-tight">{product.name}</p>
                                                <p className="text-[10px] font-black text-brand-primary/30 tracking-widest uppercase">ID-{product.id}-KLT</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className="px-4 py-1.5 bg-brand-primary text-brand-bg rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <p className="text-lg font-black tracking-tighter">${product.price.toFixed(2)}</p>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full shadow-[0_0_8px] ${product.status === 'Active' ? 'bg-brand-accent shadow-brand-accent/50' : 'bg-brand-primary/30 shadow-brand-primary/20'
                                                }`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{product.status}</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                            <button className="p-3 text-brand-primary/40 hover:text-brand-accent hover:bg-brand-accent/10 rounded-xl transition-all">
                                                <Edit3 size={18} />
                                            </button>
                                            <button className="p-3 text-brand-primary/40 hover:text-brand-accent hover:bg-brand-accent/10 rounded-xl transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Grid View */}
                <div className="grid grid-cols-1 gap-6 p-6 md:hidden">
                    {products.map((product) => (
                        <div key={product.id} className="bg-brand-primary/5 p-8 rounded-[32px] border border-brand-primary/5 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-brand-primary text-brand-bg rounded-xl flex items-center justify-center">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-tight">{product.name}</h3>
                                        <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">{product.category}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-end border-t border-brand-primary/10 pt-6">
                                <div>
                                    <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.2em] mb-1">Valuation</p>
                                    <p className="text-2xl font-black text-brand-accent tracking-tighter">${product.price.toFixed(2)}</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${product.status === 'Active' ? 'bg-brand-accent text-brand-primary' : 'bg-brand-primary/20 text-brand-primary/60'
                                    }`}>
                                    {product.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Products;
