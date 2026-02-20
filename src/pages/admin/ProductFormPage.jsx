import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Camera,
    Save,
    X,
    Info,
    Cpu,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const ProductFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        mrp: "",
        sellingPrice: "",
        discount: 0,
        category: "",
        stock: "",
        keyFeatures: [""],
        technicalSpecs: [{ key: "", value: "" }]
    });

    const [categories, setCategories] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]); // Files
    const [previewImages, setPreviewImages] = useState([]); // Blob URLs
    const [existingImages, setExistingImages] = useState([]); // Paths from server
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    useEffect(() => {
        fetchCategories();
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    // Auto-calculate discount
    useEffect(() => {
        if (formData.mrp && formData.sellingPrice) {
            const mrp = parseFloat(formData.mrp);
            const selling = parseFloat(formData.sellingPrice);
            if (mrp > 0) {
                const disc = Math.round(((mrp - selling) / mrp) * 100);
                setFormData(prev => ({ ...prev, discount: disc > 0 ? disc : 0 }));
            }
        }
    }, [formData.mrp, formData.sellingPrice]);

    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data.data);
            if (!isEdit && response.data.data.length > 0) {
                setFormData(prev => ({ ...prev, category: response.data.data[0]._id }));
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to fetch categories");
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            const product = response.data.data;

            // Convert Map/Object technicalSpecs to Array for form management
            const specsArray = product.technicalSpecs
                ? Object.entries(product.technicalSpecs).map(([key, value]) => ({ key, value }))
                : [{ key: "", value: "" }];

            setFormData({
                name: product.name,
                description: product.description,
                mrp: product.mrp,
                sellingPrice: product.sellingPrice,
                discount: product.discount,
                category: product.category._id || product.category,
                stock: product.stock,
                keyFeatures: product.keyFeatures?.length > 0 ? product.keyFeatures : [""],
                technicalSpecs: specsArray.length > 0 ? specsArray : [{ key: "", value: "" }]
            });
            setExistingImages(product.images || []);
            setFetching(false);
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Failed to fetch product details");
            navigate("/admin/products");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + selectedImages.length + existingImages.length > 5) {
            toast.error("You can only upload up to 5 images in total");
            return;
        }

        setSelectedImages(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviews]);
    };

    const removeSelectedImage = (index) => {
        // Clean up URL object to avoid memory leaks
        URL.revokeObjectURL(previewImages[index]);
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    // Key Features Handlers
    const addKeyFeature = () => {
        setFormData(prev => ({ ...prev, keyFeatures: [...prev.keyFeatures, ""] }));
    };

    const removeKeyFeature = (index) => {
        if (formData.keyFeatures.length === 1) return;
        setFormData(prev => ({
            ...prev,
            keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
        }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.keyFeatures];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, keyFeatures: newFeatures }));
    };

    // Technical Specs Handlers
    const addSpec = () => {
        setFormData(prev => ({ ...prev, technicalSpecs: [...prev.technicalSpecs, { key: "", value: "" }] }));
    };

    const removeSpec = (index) => {
        if (formData.technicalSpecs.length === 1) return;
        setFormData(prev => ({
            ...prev,
            technicalSpecs: prev.technicalSpecs.filter((_, i) => i !== index)
        }));
    };

    const handleSpecChange = (index, field, value) => {
        const newSpecs = [...formData.technicalSpecs];
        newSpecs[index][field] = value;
        setFormData(prev => ({ ...prev, technicalSpecs: newSpecs }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedImages.length === 0 && existingImages.length === 0) {
            toast.error("Please add at least one image");
            return;
        }

        setLoading(true);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("mrp", formData.mrp);
        data.append("sellingPrice", formData.sellingPrice);
        data.append("category", formData.category);
        data.append("stock", formData.stock);

        // Process arrays/objects for backend
        const filteredFeatures = formData.keyFeatures.filter(f => f.trim() !== "");
        data.append("keyFeatures", JSON.stringify(filteredFeatures));

        const specsObj = {};
        formData.technicalSpecs.forEach(spec => {
            if (spec.key.trim() && spec.value.trim()) {
                specsObj[spec.key.trim()] = spec.value.trim();
            }
        });
        data.append("technicalSpecs", JSON.stringify(specsObj));

        // Append new images
        selectedImages.forEach(image => {
            data.append("images", image);
        });

        // Append remaining existing images
        existingImages.forEach(img => {
            data.append("existingImages", img);
        });

        try {
            if (isEdit) {
                await api.put(`/products/${id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Product updated successfully");
            } else {
                await api.post("/products", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Product created successfully");
            }
            navigate("/admin/products");
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error(error.response?.data?.message || "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full mb-4"></div>
                <p className="text-brand-primary/40 font-black uppercase tracking-widest text-sm">Loading product data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500">
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
                            {isEdit ? "Refine Product" : "Launch Product"}
                        </h1>
                        <p className="text-sm font-medium text-brand-primary/40">
                            {isEdit ? `Editing: ${formData.name}` : "Introducing excellence to your catalog."}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary text-brand-bg rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-brand-bg border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <CheckCircle2 size={16} />
                    )}
                    {isEdit ? "Commit Changes" : "Publish Masterpiece"}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Core Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white p-8 rounded-[32px] border border-brand-primary/5 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-brand-primary/5">
                            <Info size={18} className="text-brand-accent" />
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">Identification & Narrative</h2>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">Product Designation</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Signature Series Stand Mixer"
                                    className="w-full px-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">Classification</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map(c => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">Inventory Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="Available units..."
                                        className="w-full px-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">Product Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="The story behind this piece, its craftsmanship, and its utility..."
                                    className="w-full px-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary resize-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Features & Specs */}
                    <div className="bg-white p-8 rounded-[32px] border border-brand-primary/5 shadow-sm space-y-8">
                        {/* Key Features */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-brand-primary/5">
                                <div className="flex items-center gap-3">
                                    <Sparkles size={18} className="text-brand-accent" />
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">Key Attributes (Optional)</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={addKeyFeature}
                                    className="p-2 bg-brand-accent/10 text-brand-accent rounded-lg hover:bg-brand-accent hover:text-brand-primary transition-all"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.keyFeatures.map((feature, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                                            placeholder="e.g. 500W High Torque Motor"
                                            className="grow px-6 py-3 bg-brand-bg border border-brand-primary/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all font-bold text-sm text-brand-primary"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeKeyFeature(index)}
                                            className="p-3 text-brand-primary/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Technical Specs */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-brand-primary/5">
                                <div className="flex items-center gap-3">
                                    <Cpu size={18} className="text-brand-accent" />
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">Technical Specifications (Optional)</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={addSpec}
                                    className="p-2 bg-brand-accent/10 text-brand-accent rounded-lg hover:bg-brand-accent hover:text-brand-primary transition-all"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.technicalSpecs.map((spec, index) => (
                                    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 border-b border-dashed border-brand-primary/5 last:border-0 relative group">
                                        <input
                                            type="text"
                                            value={spec.key}
                                            onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                                            placeholder="Label (e.g. Dimensions)"
                                            className="px-6 py-3 bg-brand-bg border border-brand-primary/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all font-bold text-xs uppercase tracking-widest text-brand-primary/40"
                                        />
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={spec.value}
                                                onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                                placeholder="Value (e.g. 15 x 10 x 12 in)"
                                                className="grow px-6 py-3 bg-brand-bg border border-brand-primary/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all font-bold text-sm text-brand-primary"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSpec(index)}
                                                className="p-3 text-brand-primary/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Imagery & Pricing */}
                <div className="space-y-8">
                    {/* Gallery */}
                    <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-sm space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent">Exquisite Gallery</h2>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Existing Saved Images */}
                            {existingImages.map((url, index) => (
                                <div key={`existing-${index}`} className="aspect-square bg-brand-bg rounded-2xl overflow-hidden relative group border border-brand-primary/5 shadow-sm">
                                    <img src={`http://localhost:5000${url}`} alt="Product" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-red-50 shadow-sm"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-brand-primary/80 text-[8px] text-white rounded font-black uppercase tracking-widest backdrop-blur-md">Saved</div>
                                </div>
                            ))}

                            {/* New Previews */}
                            {previewImages.map((url, index) => (
                                <div key={`new-${index}`} className="aspect-square bg-brand-bg rounded-2xl overflow-hidden relative group border-2 border-brand-accent/20 shadow-sm">
                                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeSelectedImage(index)}
                                        className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-red-50 shadow-sm"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-brand-accent text-[8px] text-brand-primary rounded font-black uppercase tracking-widest">New Upload</div>
                                </div>
                            ))}

                            {/* Upload Trigger */}
                            {(existingImages.length + selectedImages.length) < 5 && (
                                <label className="aspect-square bg-brand-bg border-2 border-dashed border-brand-primary/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-accent/40 hover:bg-brand-accent/5 transition-all group shadow-sm">
                                    <Camera size={24} className="text-brand-primary/20 group-hover:text-brand-accent transition-colors mb-2" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary/20 group-hover:text-brand-primary/60">Capture</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                        <p className="text-[9px] text-brand-primary/30 font-bold text-center italic uppercase tracking-wider">Showcase perfection through high-res imagery.</p>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-sm space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent">Economic Strategy</h2>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">Market Price (MRP)</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-brand-primary/40">₹</span>
                                    <input
                                        type="number"
                                        name="mrp"
                                        value={formData.mrp}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-6 py-4 bg-brand-bg border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-brand-primary"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between px-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Our Selling Value</label>
                                    {formData.discount > 0 && (
                                        <span className="text-[10px] font-black text-brand-accent italic uppercase tracking-widest animate-pulse">Save {formData.discount}%</span>
                                    )}
                                </div>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-brand-primary">₹</span>
                                    <input
                                        type="number"
                                        name="sellingPrice"
                                        value={formData.sellingPrice}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-6 py-4 bg-white border-2 border-brand-accent/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all font-black text-brand-primary text-xl"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {formData.mrp && formData.sellingPrice && (
                            <div className="p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/5 space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">
                                    <span>Profit Margin Calc</span>
                                    <span>Live</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[8px] font-black text-brand-primary/20 uppercase">Total Difference</p>
                                        <p className="text-sm font-black text-brand-primary">₹{Math.max(0, formData.mrp - formData.sellingPrice)} Off</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-brand-primary/20 uppercase">Deal Rating</p>
                                        <p className={`text-sm font-black ${formData.discount > 30 ? 'text-green-500' : 'text-brand-accent'}`}>
                                            {formData.discount > 30 ? 'Aggressive' : 'Premium'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;
