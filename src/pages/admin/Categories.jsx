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
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">Categories</h1>
                    <p className="text-sm font-medium text-brand-primary/40">Manage your menu categories and their descriptions.</p>
                </div>
                <Link
                    to="/admin/categories/create"
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-brand-primary text-brand-bg rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20"
                >
                    <Plus size={18} />
                    Add New Category
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20" size={20} />
                    <input
                        type="text"
                        placeholder="Search categories by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-medium text-brand-primary shadow-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[32px] border border-brand-primary/5 shadow-sm overflow-hidden overflow-x-auto">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-brand-primary/40 font-bold uppercase tracking-widest text-xs">Loading Categories...</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-brand-primary/5 border-b border-brand-primary/5">
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Category Name</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Description</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Created At</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-primary/5">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <tr key={category._id} className="hover:bg-brand-primary/5 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center text-brand-primary/20">
                                                    <LayoutGrid size={20} />
                                                </div>
                                                <h3 className="font-black text-brand-primary leading-tight">{category.name}</h3>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-brand-primary/60 max-w-sm font-medium line-clamp-1">
                                                {category.description}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-brand-primary/40">
                                                {new Date(category.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/categories/edit/${category._id}`}
                                                    className="p-3 bg-brand-bg text-brand-primary rounded-xl hover:bg-brand-primary hover:text-brand-bg transition-all"
                                                    title="Edit Category"
                                                >
                                                    <Edit2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(category)}
                                                    className="p-3 bg-brand-bg text-red-500 rounded-xl hover:bg-red-500 hover:text-brand-bg transition-all"
                                                    title="Delete Category"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <p className="text-brand-primary/20 font-black uppercase tracking-widest text-sm">No categories found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete Confirmation Modal */}
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
