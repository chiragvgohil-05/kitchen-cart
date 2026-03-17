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
                toast.success("Category updated");
            } else {
                await api.post("/categories", formData);
                toast.success("New category added");
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
                <div className="animate-spin w-16 h-16 border-[6px] border-accent-gold border-t-transparent rounded-full mb-6"></div>
                <p className="text-coffee-brown/30 font-bold tracking-wide text-sm">Loading Data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                <div className="space-y-4">
                    <Link
                        to="/admin/categories"
                        className="inline-flex items-center gap-3 text-sm font-bold tracking-wide text-coffee-brown/40 hover:text-accent-gold transition-colors mb-4 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        RETURN TO COLLECTIONS
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-coffee-brown tracking-tighter leading-[0.85]">
                        {isEditMode ? <>EDIT <br /><span className="text-accent-gold not-">CATEGORY</span></> : <>ADD <br /><span className="text-accent-gold not-">CATEGORY</span></>}
                    </h1>
                    <p className="text-sm font-bold text-coffee-brown/30 tracking-wide leading-relaxed">
                        {isEditMode ? "Editing an existing category." : "Adding a new category."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="bg-white/40 backdrop-blur-2xl rounded-3xl border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 p-6 lg:p-8 space-y-12">
                    {/* Basic Info */}
                    <div className="space-y-10">
                        <div className="flex items-center gap-4 pb-6 border-b border-coffee-brown/5">
                            <div className="w-12 h-12 bg-coffee-brown text-accent-gold rounded-2xl flex items-center justify-center shadow-lg shadow-coffee-brown/10">
                                <LayoutGrid size={24} strokeWidth={1} />
                            </div>
                            <h2 className="text-xl font-bold text-coffee-brown tracking-tighter">Category Details</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4">
                                <label className="text-sm font-bold tracking-wide text-coffee-brown/40 ml-2">Category Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Vintage Brews"
                                    className="w-full px-8 py-6 bg-white border border-coffee-brown/5 rounded-full focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all font-bold text-sm tracking-wide text-coffee-brown placeholder:text-coffee-brown/10 shadow-inner"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold tracking-wide text-coffee-brown/40 ml-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    placeholder="Description of this category..."
                                    className="w-full px-8 py-6 bg-white border border-coffee-brown/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all font-bold text-sm tracking-wide text-coffee-brown placeholder:text-coffee-brown/10 shadow-inner resize-none leading-relaxed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-6">
                    <Link
                        to="/admin/categories"
                        className="w-full sm:w-auto px-6 py-3 bg-white/40 backdrop-blur-xl border border-coffee-brown/10 text-coffee-brown/40 rounded-full font-bold text-sm tracking-wide hover:text-coffee-brown hover:border-coffee-brown transition-all text-center"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto h-12 flex items-center justify-center gap-4 px-16 bg-coffee-brown text-white rounded-full font-bold text-sm tracking-wide hover:bg-accent-gold transition-all shadow-2xl shadow-coffee-brown/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Save size={18} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                        )}
                        {isEditMode ? "SAVE CHANGES" : "ADD CATEGORY"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryFormPage;
