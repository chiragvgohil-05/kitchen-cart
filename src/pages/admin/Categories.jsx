import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import DeleteModal from "../../components/admin/DeleteModal";
import toast from "react-hot-toast";

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to fetch categories");
            setLoading(false);
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (category) => {
        setSelectedCategory(category);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/categories/${selectedCategory._id}`);
            toast.success("Category deleted successfully");
            fetchCategories();
            setIsDeleteOpen(false);
            setSelectedCategory(null);
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error(error.response?.data?.message || "Failed to delete category");
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="space-y-10 pb-12 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-coffee-brown tracking-tighter">Menu <span className="text-accent-gold">Collections</span></h1>
                    <p className="text-xs font-bold text-coffee-brown/40 tracking-wide">Architect the sensory experience of Our Store</p>
                </div>
                <Link
                    to="/admin/categories/create"
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-coffee-brown text-white rounded-[24px] font-bold text-sm tracking-wide hover:bg-accent-gold transition-all shadow-xl shadow-coffee-brown/20 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    New Signature Category
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-coffee-brown/20 group-focus-within:text-accent-gold transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search for a collection..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-8 py-3 bg-white border border-coffee-brown/5 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all font-bold text-coffee-brown tracking-widest text-xs placeholder-coffee-brown/20"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[48px] border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 overflow-hidden overflow-x-auto">
                {loading ? (
                    <div className="p-32 text-center">
                        <div className="animate-spin w-12 h-12 border-[6px] border-accent-gold border-t-transparent rounded-full mx-auto mb-6"></div>
                        <p className="text-coffee-brown/40 font-medium text-sm">Filtering data through store...</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-cream/50 border-b border-coffee-brown/5">
                                <th className="px-6 py-8 text-sm font-bold tracking-wide text-coffee-brown/30">Collection Historerchy</th>
                                <th className="px-6 py-8 text-sm font-bold tracking-wide text-coffee-brown/30">Abstract/Narrative</th>
                                <th className="px-6 py-8 text-[10px) font-bold tracking-wide text-coffee-brown/30">Store Entry</th>
                                <th className="px-6 py-8 text-sm font-bold tracking-wide text-coffee-brown/30 text-right">Opstoretional Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-coffee-brown/5">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <tr key={category._id} className="hover:bg-cream/30 transition-all group">
                                        <td className="px-6 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-cream rounded-3xl flex items-center justify-center text-accent-gold shadow-inner group-hover:scale-110 transition-transform">
                                                    <LayoutGrid size={24} strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-coffee-brown tracking-tight group-hover:text-accent-gold transition-colors">{category.name}</h3>
                                                    <span className="text-sm font-bold text-coffee-brown/20 tracking-widest">Active Category</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <p className="text-xs text-coffee-brown/60 max-w-sm font-bold leading-relaxed line-clamp-2 tracking-wide">
                                                {category.description || 'No description provided for this store.'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-8">
                                            <span className="text-sm font-bold text-coffee-brown/30 tracking-wide tabular-nums">
                                                {new Date(category.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    to={`/admin/categories/edit/${category._id}`}
                                                    className="p-4 bg-cream text-coffee-brown rounded-2xl hover:bg-accent-gold hover:text-white transition-all shadow-sm"
                                                    title="Refine Collection"
                                                >
                                                    <Edit2 size={20} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(category)}
                                                    className="p-4 bg-cream text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    title="Dissolve Collection"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-40 text-center">
                                        <div className="inline-flex items-center justify-center w-24 h-24 bg-cream rounded-full mb-8">
                                            <Search size={40} className="text-coffee-brown/10" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-coffee-brown tracking-tighter">No store found</h2>
                                        <p className="text-sm font-bold text-coffee-brown/30 tracking-wide mt-2">Adjust your search parameters</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <DeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                itemName={selectedCategory?.name}
            />
        </div>
    );
};

export default AdminCategories;
