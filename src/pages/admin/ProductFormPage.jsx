import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Camera, Save, X } from "lucide-react";
import { products, categories } from "../../data/products";

const ProductFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const initialFormState = {
        title: "",
        brand: "",
        price: "",
        oldPrice: "",
        discount: "",
        category: categories[1] || "Appliances",
        images: ["", ""],
        description: "",
        features: ["", "", ""],
        specs: {
            "Power": "",
            "Capacity": "",
            "Weight": ""
        }
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isEdit) {
            const productToEdit = products.find(p => p.id === parseInt(id));
            if (productToEdit) {
                setFormData({
                    ...initialFormState,
                    ...productToEdit,
                    // Ensure arrays and objects exist
                    images: productToEdit.images || ["", ""],
                    features: productToEdit.features || ["", "", ""],
                    specs: productToEdit.specs || { "Power": "", "Capacity": "", "Weight": "" }
                });
            }
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (index, value, field) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const removeArrayItem = (index, field) => {
        if (formData[field].length <= 1) return;
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const handleSpecChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            specs: { ...prev.specs, [key]: value }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would be an API call (POST or PUT)
        console.log("Saving product data:", formData);
        navigate("/admin/products");
    };

    return (
        <div className="pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/products"
                        className="p-3 bg-white border border-brand-primary/5 text-brand-primary rounded-xl hover:bg-brand-primary hover:text-brand-bg transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
                            {isEdit ? "Update Product" : "Create Product"}
                        </h1>
                        <p className="text-sm font-medium text-brand-primary/40">
                            {isEdit ? `Editing: ${formData.title}` : "Add a new premium piece to your catalog."}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary text-brand-bg rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20"
                >
                    <Save size={18} />
                    {isEdit ? "Update Product" : "Publish Product"}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Core Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white p-8 rounded-[32px] border border-brand-primary/5 shadow-sm space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent">Basic Information</h2>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">Product Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Professional Stand Mixer"
                                    className="w-full px-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">Brand Name</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        placeholder="e.g. KitchenAid"
                                        className="w-full px-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary appearance-none cursor-pointer"
                                    >
                                        {categories.filter(c => c !== "All").map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="Describe the product details, inspiration, and craftsmanship..."
                                    className="w-full px-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary resize-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Offer */}
                    <div className="bg-white p-8 rounded-[32px] border border-brand-primary/5 shadow-sm space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent">Pricing Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">Regular Price (JSON Format)</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="e.g. 24,900.00"
                                    className="w-full px-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">Old Price (Optional)</label>
                                <input
                                    type="text"
                                    name="oldPrice"
                                    value={formData.oldPrice}
                                    onChange={handleChange}
                                    placeholder="e.g. 34,900.00"
                                    className="w-full px-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary opacity-60"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">Discount %</label>
                                <input
                                    type="text"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    placeholder="e.g. 20%"
                                    className="w-full px-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary text-brand-accent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Features Array */}
                    <div className="bg-white p-8 rounded-[32px] border border-brand-primary/5 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent">Key Features</h2>
                            <button
                                type="button"
                                onClick={() => addArrayItem("features")}
                                className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 hover:text-brand-accent transition-colors flex items-center gap-1"
                            >
                                <Plus size={12} /> Add Feature
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleArrayChange(index, e.target.value, "features")}
                                        className="grow px-6 py-3 bg-brand-bg border border-brand-primary/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all font-bold text-sm text-brand-primary"
                                        placeholder={`Feature ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(index, "features")}
                                        className="p-3 text-brand-primary/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Images & Specs */}
                <div className="space-y-8">
                    {/* Media Setup */}
                    <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent">Product Gallery</h2>
                            <button
                                type="button"
                                onClick={() => addArrayItem("images")}
                                className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 hover:text-brand-accent transition-colors"
                            >
                                Add URL
                            </button>
                        </div>
                        <div className="space-y-4">
                            {formData.images.map((url, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="aspect-[4/3] bg-brand-bg rounded-2xl border border-dashed border-brand-primary/10 overflow-hidden relative group">
                                        {url ? (
                                            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-brand-primary/20">
                                                <Camera size={24} className="mb-2" />
                                                <p className="text-[8px] font-black tracking-widest uppercase">No Image</p>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem(index, "images")}
                                            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-red-50"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => handleArrayChange(index, e.target.value, "images")}
                                        className="w-full px-4 py-2 bg-brand-bg border border-brand-primary/5 rounded-xl text-[10px] font-bold text-brand-primary/60 truncate focus:outline-none focus:ring-1 focus:ring-brand-accent"
                                        placeholder="Enter Image URL"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Technical Specs */}
                    <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-sm space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent">Technical Specs</h2>
                        <div className="space-y-4">
                            {Object.entries(formData.specs).map(([key, value]) => (
                                <div key={key} className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">{key}</label>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleSpecChange(key, e.target.value)}
                                        placeholder={`Enter ${key}`}
                                        className="w-full px-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default ProductFormPage;
