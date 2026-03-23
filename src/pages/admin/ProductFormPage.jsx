import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Save,
    X,
    Info,
    Cpu,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import api from "../../utils/api";
import { getProductImageUrl } from "../../utils/mediaUrl";
import { calculateDiscountPercentage } from "../../utils/pricing";
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
        const discount = calculateDiscountPercentage(formData.mrp, formData.sellingPrice);
        setFormData(prev => ({ ...prev, discount }));
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
                discount: calculateDiscountPercentage(product.mrp, product.sellingPrice),
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
            toast.error("Limit: 5 artifact visuals");
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
            toast.error("A product must have at least one image.");
            return;
        }


        setLoading(true);

        const mrpValue = Number(formData.mrp);
        const sellingPriceValue = Number(formData.sellingPrice);
        if (!Number.isFinite(mrpValue) || mrpValue <= 0) {
            toast.error("MRP must be a positive value.");
            setLoading(false);
            return;
        }

        if (!Number.isFinite(sellingPriceValue) || sellingPriceValue < 0) {
            toast.error("Selling price cannot be negative.");
            setLoading(false);
            return;
        }

        if (sellingPriceValue > mrpValue) {
            toast.error("Store Sacrifice cannot exceed the Standard Aura (MRP).");
            setLoading(false);
            return;
        }



        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("mrp", mrpValue.toString());
        data.append("sellingPrice", sellingPriceValue.toString());
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
                const response = await api.put(`/products/${id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                if (response.status !== 200 || !response.data?.success) {
                    throw new Error(response.data?.message || "Error updating artifact");
                }
                toast.success("Product updated successfully.");

            } else {
                const response = await api.post("/products", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                if (response.status !== 201 || !response.data?.success) {
                    throw new Error(response.data?.message || "Error initiating artifact");
                }
                toast.success("New product added to the inventory successfully.");

            }
            navigate("/admin/products");
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error(error.response?.data?.errors || error.response?.data?.message || error.message || "Failed to save product information");

        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin w-16 h-16 border-[6px] border-accent-gold border-t-transparent rounded-full mb-6"></div>
                <p className="text-coffee-brown/30 font-bold tracking-wide text-sm">Loading Product Details...</p>
            </div>

        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-12 animate-fade-in p-2">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="flex items-start gap-6">
                    <Link
                        to="/admin/products"
                        className="mt-2 p-5 bg-white/40 backdrop-blur-xl border border-coffee-brown/5 text-coffee-brown rounded-[24px] hover:bg-coffee-brown hover:text-white transition-all shadow-2xl shadow-coffee-brown/5 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-coffee-brown tracking-tighter leading-[0.85]">
                            {isEdit ? <>UPDATE <br /><span className="text-accent-gold not-">PRODUCT</span></> : <>ADD NEW <br /><span className="text-accent-gold not-">PRODUCT</span></>}
                        </h1>
                        <p className="text-sm font-bold text-coffee-brown/30 tracking-wide leading-relaxed max-w-sm">
                            {isEdit ? `Modifying the specifications for ${formData.name.toUpperCase()}.` : "Add a new premium item to the SnowEra Cafe menu."}
                        </p>

                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="h-12 flex items-center justify-center gap-6 px-16 bg-coffee-brown text-white rounded-full font-bold text-sm tracking-wide hover:bg-accent-gold transition-all shadow-2xl shadow-coffee-brown/20 disabled:opacity-50 group"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <CheckCircle2 size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                    )}
                    {isEdit ? "Update Product" : "Add New Product"}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Core Details */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Basic Information */}
                    <div className="bg-white/40 backdrop-blur-2xl p-6 lg:p-8 rounded-3xl border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 space-y-10">
                        <div className="flex items-center gap-4 pb-6 border-b border-coffee-brown/5">
                            <Info size={24} strokeWidth={1} className="text-accent-gold" />
                            <h2 className="text-xl font-bold tracking-tighter text-coffee-brown">General Information</h2>
                        </div>


                        <div className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-sm font-bold tracking-wide text-coffee-brown/40 ml-2">Product Official Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. VINTAGE ESPRESSO MACHINE X1"
                                    className="w-full px-8 py-6 bg-white border border-coffee-brown/5 rounded-full focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all font-bold text-sm tracking-wide text-coffee-brown placeholder:text-coffee-brown/10 shadow-inner"
                                    required
                                />
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-sm font-bold tracking-wide text-coffee-brown/40 ml-2">Menu Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-8 py-6 bg-white border border-coffee-brown/5 rounded-full focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all font-bold text-sm tracking-wide text-coffee-brown appearance-none cursor-pointer shadow-inner"
                                    >
                                        <option value="" disabled>SELECT CATEGORY</option>
                                        {categories.map(c => (
                                            <option key={c._id} value={c._id}>{c.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-bold tracking-wide text-coffee-brown/40 ml-2">Current Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="UNITS AVAILABLE..."
                                        className="w-full px-8 py-6 bg-white border border-coffee-brown/5 rounded-full focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all font-bold text-sm tracking-wide text-coffee-brown placeholder:text-coffee-brown/10 shadow-inner"
                                        required
                                    />
                                </div>
                            </div>


                            <div className="space-y-4">
                                <label className="text-sm font-bold tracking-wide text-coffee-brown/40 ml-2">Detailed Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="Provide a professional description of the product, its benefits, and usage..."
                                    className="w-full px-8 py-6 bg-white border border-coffee-brown/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all font-bold text-sm tracking-wide text-coffee-brown placeholder:text-coffee-brown/10 shadow-inner resize-none leading-relaxed"
                                    required
                                />
                            </div>
                        </div>
                    </div>


                    {/* Features & Specs */}
                    <div className="bg-white/40 backdrop-blur-2xl p-6 lg:p-8 rounded-3xl border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 space-y-12">
                        {/* Key Features */}
                        <div className="space-y-10">
                            <div className="flex items-center justify-between pb-6 border-b border-coffee-brown/5">
                                <div className="flex items-center gap-4">
                                    <Sparkles size={24} strokeWidth={1} className="text-accent-gold" />
                                    <h2 className="text-xl font-bold tracking-tighter text-coffee-brown leading-none">Key Features</h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={addKeyFeature}
                                    className="p-3 bg-accent-gold/10 text-accent-gold rounded-xl hover:bg-accent-gold hover:text-white transition-all shadow-lg shadow-accent-gold/5"
                                >
                                    <Plus size={20} strokeWidth={2.5} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {formData.keyFeatures.map((feature, index) => (
                                    <div key={index} className="flex gap-4 group">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                                            placeholder="e.g. 100% Organic Arabica Blend"
                                            className="grow px-8 py-3 bg-white border border-coffee-brown/5 rounded-full focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all font-bold text-sm tracking-wide text-coffee-brown shadow-inner"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeKeyFeature(index)}
                                            className="p-4 text-coffee-brown/20 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Technical Specs */}
                        <div className="space-y-10">
                            <div className="flex items-center justify-between pb-6 border-b border-coffee-brown/5">
                                <div className="flex items-center gap-4">
                                    <Cpu size={24} strokeWidth={1} className="text-accent-gold" />
                                    <h2 className="text-xl font-bold tracking-tighter text-coffee-brown leading-none">Technical Specifications</h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={addSpec}
                                    className="p-3 bg-accent-gold/10 text-accent-gold rounded-xl hover:bg-accent-gold hover:text-white transition-all shadow-lg shadow-accent-gold/5"
                                >
                                    <Plus size={20} strokeWidth={2.5} />
                                </button>
                            </div>

                            <div className="space-y-10">
                                {formData.technicalSpecs.map((spec, index) => (
                                    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-10 border-b border-dashed border-coffee-brown/10 last:border-0 relative group">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-bold tracking-wide text-coffee-brown/30 ml-2">Spec Label</label>
                                            <input
                                                type="text"
                                                value={spec.key}
                                                onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                                                placeholder="e.g. Weight / Material"
                                                className="w-full px-8 py-3 bg-white border border-coffee-brown/5 rounded-full focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all font-bold text-sm tracking-wide text-coffee-brown shadow-inner"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[9px] font-bold tracking-wide text-coffee-brown/30 ml-2">Spec Value</label>
                                            <div className="flex gap-4">
                                                <input
                                                    type="text"
                                                    value={spec.value}
                                                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                                    placeholder="e.g. 500g / Stainless Steel"
                                                    className="grow px-8 py-3 bg-white border border-coffee-brown/5 rounded-full focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all font-bold text-sm tracking-wide text-coffee-brown shadow-inner"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => removeSpec(index)}
                                                    className="p-4 text-coffee-brown/20 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Imagery & Pricing */}
                <div className="space-y-12">
                    {/* Gallery */}
                    <div className="bg-white/40 backdrop-blur-2xl p-6 rounded-3xl border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 space-y-10">
                        <div className="space-y-2">
                            <h2 className="text-sm font-bold tracking-wide text-accent-gold">Product Gallery</h2>
                            <p className="text-[9px] font-bold tracking-widest text-coffee-brown/30 leading-relaxed">Upload high-quality images of the product.</p>
                        </div>


                        <div className="grid grid-cols-2 gap-6">
                            {/* Existing Saved Images */}
                            {existingImages.map((url, index) => (
                                <div key={`existing-${index}`} className="aspect-square bg-cream rounded-xl overflow-hidden relative group border border-coffee-brown/10 shadow-inner">
                                    <img src={getProductImageUrl(url)} alt="Product" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        className="absolute top-3 right-3 p-3 bg-red-500 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-xl shadow-red-500/30"
                                    >
                                        <Trash2 size={16} strokeWidth={2.5} />
                                    </button>
                                    <div className="absolute bottom-3 left-3 px-4 py-1.5 bg-coffee-brown/90 text-[8px] text-white rounded-full font-bold tracking-wide backdrop-blur-md">SAVED</div>
                                </div>

                            ))}

                            {/* New Previews */}
                            {previewImages.map((url, index) => (
                                <div key={`new-${index}`} className="aspect-square bg-cream rounded-xl overflow-hidden relative group border-2 border-accent-gold/30 shadow-2xl shadow-accent-gold/10">
                                    <img src={url} alt="Product Preview" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110" />

                                    <button
                                        type="button"
                                        onClick={() => removeSelectedImage(index)}
                                        className="absolute top-3 right-3 p-3 bg-red-500 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-xl shadow-red-500/30"
                                    >
                                        <Trash2 size={16} strokeWidth={2.5} />
                                    </button>
                                    <div className="absolute bottom-3 left-3 px-4 py-1.5 bg-accent-gold text-[8px] text-white rounded-full font-bold tracking-wide shadow-lg shadow-accent-gold/20">NEW UPLOAD</div>
                                </div>

                            ))}

                            {/* Upload Trigger */}
                            {(existingImages.length + selectedImages.length) < 5 && (
                                <label className="aspect-square bg-white/40 border-2 border-dashed border-coffee-brown/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-gold/40 hover:bg-accent-gold/5 transition-all group shadow-inner">
                                    <Save size={32} strokeWidth={1} className="text-coffee-brown/20 group-hover:text-accent-gold transition-all duration-500 mb-3 group-hover:scale-110" />
                                    <span className="text-[9px] font-bold tracking-wide text-coffee-brown/20 group-hover:text-coffee-brown transition-colors">UPLOAD</span>

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
                    </div>

                    {/* Aura Calibration */}
                    <div className="bg-white/40 backdrop-blur-2xl p-6 rounded-3xl border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 space-y-10">
                        <div className="space-y-2">
                            <h2 className="text-sm font-bold tracking-wide text-accent-gold uppercase">Aura Calibration</h2>
                            <p className="text-[9px] font-bold tracking-widest text-coffee-brown/30 leading-relaxed uppercase">Defining the worth within the SnowEra economy.</p>
                        </div>


                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black tracking-wide text-coffee-brown/40 ml-2 uppercase">Standard Aura (MRP)</label>
                                <div className="relative">
                                    <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-coffee-brown/20 text-[10px] tracking-[0.2em]">AURA</span>
                                    <input
                                        type="number"
                                        name="mrp"
                                        value={formData.mrp}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full pl-24 pr-8 py-6 bg-white border border-coffee-brown/5 rounded-full focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all font-black text-[12px] text-coffee-brown shadow-inner"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between px-2">
                                    <label className="text-[10px] font-black tracking-wide text-coffee-brown/40 uppercase">Store Sacrifice (Price)</label>
                                    {formData.discount > 0 && (
                                        <span className="text-[10px] font-black text-accent-gold tracking-widest animate-pulse uppercase">{formData.discount}% YIELD</span>
                                    )}
                                </div>

                                <div className="relative">
                                    <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-coffee-brown text-[10px] tracking-[0.2em]">VAL</span>

                                    <input
                                        type="number"
                                        name="sellingPrice"
                                        value={formData.sellingPrice}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full pl-24 pr-8 py-8 bg-white border-[3px] border-accent-gold/20 rounded-full focus:outline-none focus:ring-8 focus:ring-accent-gold/5 focus:border-accent-gold transition-all font-black text-coffee-brown text-2xl shadow-2xl shadow-accent-gold/5"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {formData.mrp && formData.sellingPrice && (
                            <div className="p-8 bg-coffee-brown/5 rounded-2xl border border-coffee-brown/5 space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                                <div className="flex justify-between items-center relative z-10">
                                    <span className="text-[9px] font-black text-coffee-brown/40 tracking-widest uppercase">Store Analytics</span>
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                </div>

                                <div className="flex justify-between items-end relative z-10">
                                    <div className="space-y-2">
                                        <p className="text-[8px] font-black text-coffee-brown/20 tracking-[0.2em] uppercase">Total Delta</p>
                                        <p className="text-xl font-black text-coffee-brown tabular-nums tracking-tighter">₹{Math.max(0, formData.mrp - formData.sellingPrice)} REMITTED</p>
                                    </div>

                                    <div className="text-right space-y-2">
                                        <p className="text-[8px] font-black text-coffee-brown/20 tracking-[0.2em] uppercase">Curation Tier</p>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${formData.discount > 30 ? 'text-green-600' : 'text-accent-gold'}`}>
                                            {formData.discount > 30 ? 'ELITE HARVEST' : 'PRIME STOCK'}
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
