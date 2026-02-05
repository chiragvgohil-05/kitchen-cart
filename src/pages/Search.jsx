import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, Filter, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import ProductCard from "../components/ProductCard";

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [localQuery, setLocalQuery] = useState(query);

    const handleSearch = (e) => {
        e.preventDefault();
        if (localQuery.trim()) {
            setSearchParams({ q: localQuery });
        }
    };

    // Mock results for demonstration with multiple images
    const mockResults = [
        {
            id: 1,
            title: "Premium Kitchen Knife Set",
            brand: "ApniDukaan",
            price: "12,999.00",
            oldPrice: "15,500.00",
            discount: "17%",
            images: [
                "https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1614362945742-d610bc9318a4?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?q=80&w=600&auto=format&fit=crop"
            ]
        },
        {
            id: 2,
            title: "Professional Stand Mixer",
            brand: "Hafele",
            price: "34,900.00",
            oldPrice: "40,310.00",
            discount: "15%",
            images: [
                "https://images.unsplash.com/photo-1594385208974-2e75f9d8ad48?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop"
            ]
        },
        {
            id: 3,
            title: "Nero 30 – 30 cm Built-in 2 Zone Induction Hob",
            brand: "Hafele",
            price: "33,140.00",
            oldPrice: "40,310.00",
            discount: "17%",
            images: [
                "https://images.unsplash.com/photo-1584990333939-7290082697ec?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1521133573832-34c920bc6bc0?q=80&w=600&auto=format&fit=crop"
            ]
        },
    ];

    return (
        <div className="py-8 space-y-8 animate-in fade-in duration-500">
            {/* Search Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-primary">
                        {query ? `Results for "${query}"` : "Search Our Store"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Find the perfect tools for your dream kitchen.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="grow max-w-md">
                    <div className="relative group">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            className="w-full bg-white border-2 border-brand-primary/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary/30 transition-all shadow-sm"
                            placeholder="Try searching for 'Induction'..."
                        />
                    </div>
                </form>
            </div>

            {/* Filters Bar */}
            <div className="flex items-center justify-between py-4 border-y border-gray-100">
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-accent transition-colors">
                        <Filter size={18} />
                        All Categories
                    </button>
                    <button className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-accent transition-colors">
                        <SlidersHorizontal size={18} />
                        Filter & Sort
                    </button>
                </div>
                <div className="text-sm font-medium text-gray-400">
                    Showing 1-{query ? mockResults.length : 0} of {query ? mockResults.length : 0} results
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {query ? (
                    mockResults.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                            <SearchIcon size={32} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-brand-primary">Start your search</h2>
                        <p className="text-gray-400 max-w-xs mx-auto">Try typing something like "Oven," "Mixer," or "Chef Knife" to browse our collection.</p>
                    </div>
                )}
            </div>

            {/* Promotional Section if no query */}
            {!query && (
                <div className="pt-12">
                    <h3 className="text-lg font-black text-brand-primary mb-6">Popular Categories</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["Appliances", "Cookware", "Cutlery", "Baking"].map((cat) => (
                            <div key={cat} className="p-6 bg-brand-bg/50 rounded-2xl border border-brand-primary/5 hover:border-brand-accent/30 hover:bg-white transition-all cursor-pointer text-center group">
                                <p className="font-bold text-brand-primary group-hover:text-brand-accent transition-colors">{cat}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
