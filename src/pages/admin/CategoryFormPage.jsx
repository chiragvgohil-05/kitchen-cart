import { useState, useEffect } from "react";
import { ArrowLeft, Save, LayoutGrid } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";

const CategoryFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);

    useEffect(() => {
        if (isEditMode) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategory = async () => {
        try {
            const response = await api.get(`/categories/${id}`);
            const { name, description } = response.data.data;
            setFormData({ name, description });
            setFetching(false);
        } catch (error) {
            console.error("Error fetching category:", error);
            toast.error("Failed to fetch category details");
            navigate("/admin/categories");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                await api.put(`/categories/${id}`, formData);
                toast.success("Category updated successfully");
            } else {
                await api.post("/categories", formData);
                toast.success("Category created successfully");
            }
            navigate("/admin/categories");
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error(error.response?.data?.message || "Failed to save category");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full mb-4"></div>
                <p className="text-brand-primary/40 font-black uppercase tracking-widest text-sm">Loading category data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                    <Link
                        to="/admin/categories"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary/40 hover:text-brand-accent transition-colors mb-2"
                    >
                        <ArrowLeft size={14} />
                        Back to Categories
                    </Link>
                    <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
                        {isEditMode ? "Edit Category" : "Add New Category"}
                    </h1>
                    <p className="text-sm font-medium text-brand-primary/40">
                        {isEditMode ? "Update the details of your category." : "Create a new category for your menu."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-[32px] border border-brand-primary/5 shadow-sm p-8 space-y-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-brand-primary/5">
                            <div className="w-8 h-8 bg-brand-accent/10 rounded-lg flex items-center justify-center text-brand-accent">
                                <LayoutGrid size={18} />
                            </div>
                            <h2 className="font-black text-brand-primary uppercase tracking-wider text-sm">Category Information</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">Category Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Appetizers, Main Course, Desserts"
                                    className="w-full px-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary placeholder:text-brand-primary/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    placeholder="Brief description of what this category includes..."
                                    className="w-full px-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary placeholder:text-brand-primary/20 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Link
                        to="/admin/categories"
                        className="px-8 py-4 bg-white border border-brand-primary/5 text-brand-primary/60 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary/5 transition-all"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-10 py-4 bg-brand-primary text-brand-bg rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-brand-bg border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Save size={18} />
                        )}
                        {isEditMode ? "Update Category" : "Save Category"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryFormPage;
