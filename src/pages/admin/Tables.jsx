import { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, MapPin, Users, CheckCircle2, AlertCircle, Coffee, RotateCcw } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AdminTables = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [formData, setFormData] = useState({
        tableNumber: "",
        capacity: 2,
        location: "Indoor",
        status: "Available"
    });

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            setLoading(true);
            const response = await api.get("/tables");
            setTables(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch tables");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTable) {
                await api.put(`/tables/${editingTable._id}`, formData);
                toast.success("Table updated successfully");
            } else {
                await api.post("/tables", formData);
                toast.success("Table created successfully");
            }
            setIsModalOpen(false);
            setEditingTable(null);
            setFormData({ tableNumber: "", capacity: 2, location: "Indoor", status: "Available" });
            fetchTables();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this table?")) return;
        try {
            await api.delete(`/tables/${id}`);
            toast.success("Table deleted successfully");
            fetchTables();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete table");
        }
    };

    const handleEdit = (table) => {
        setEditingTable(table);
        setFormData({
            tableNumber: table.tableNumber,
            capacity: table.capacity,
            location: table.location,
            status: table.status
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-coffee-brown tracking-tight">Table Management</h1>
                    <p className="text-sm font-bold text-coffee-brown/30 uppercase tracking-widest">Inventory & Layout Control</p>
                </div>
                <button 
                    onClick={() => { setEditingTable(null); setIsModalOpen(true); }}
                    className="flex items-center justify-center gap-2 bg-coffee-brown text-white px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-coffee-brown/10"
                >
                    <Plus size={16} />
                    Add New Table
                </button>
            </div>

            {loading ? (
                <div className="p-24 text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full mx-auto" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tables.map(table => (
                        <div key={table._id} className="bg-white rounded-3xl p-6 border border-coffee-brown/5 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button onClick={() => handleEdit(table)} className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                                    <Edit3 size={14} />
                                </button>
                                <button onClick={() => handleDelete(table._id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-colors ${
                                    table.status === 'Available' ? 'bg-green-50 text-green-500' : 
                                    table.status === 'Reserved' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'
                                }`}>
                                    {table.tableNumber}
                                </div>
                                <div>
                                    <h3 className="font-black text-coffee-brown tracking-tight">Table {table.tableNumber}</h3>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                                        table.status === 'Available' ? 'text-green-500' : 
                                        table.status === 'Reserved' ? 'text-amber-500' : 'text-red-500'
                                    }`}>
                                        {table.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-xs font-bold text-coffee-brown/50">
                                    <Users size={14} className="text-coffee-brown/20" />
                                    <span>Capacity: {table.capacity} Persons</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-coffee-brown/50">
                                    <MapPin size={14} className="text-coffee-brown/20" />
                                    <span>Location: {table.location}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-coffee-brown/5 flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {[...Array(Math.min(table.capacity, 4))].map((_, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-coffee-brown/5 flex items-center justify-center text-[8px] font-black text-coffee-brown/20">
                                            U
                                        </div>
                                    ))}
                                    {table.capacity > 4 && (
                                        <div className="w-6 h-6 rounded-full border-2 border-white bg-accent-gold/10 flex items-center justify-center text-[8px] font-black text-accent-gold">
                                            +{table.capacity - 4}
                                        </div>
                                    )}
                                </div>
                                <Coffee size={18} className="text-coffee-brown/5" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-coffee-brown/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 relative shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-black text-coffee-brown mb-8 tracking-tight">
                            {editingTable ? `Edit Table ${editingTable.tableNumber}` : 'Add New Table'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-coffee-brown/40 uppercase tracking-widest px-1">Table #</label>
                                    <input 
                                        type="text"
                                        className="w-full px-5 py-4 bg-coffee-brown/5 border-transparent rounded-2xl focus:ring-2 focus:ring-accent-gold/20 focus:bg-white transition-all font-bold text-coffee-brown"
                                        value={formData.tableNumber}
                                        onChange={(e) => setFormData({...formData, tableNumber: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-coffee-brown/40 uppercase tracking-widest px-1">Capacity</label>
                                    <input 
                                        type="number"
                                        className="w-full px-5 py-4 bg-coffee-brown/5 border-transparent rounded-2xl focus:ring-2 focus:ring-accent-gold/20 focus:bg-white transition-all font-bold text-coffee-brown"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-coffee-brown/40 uppercase tracking-widest px-1">Location</label>
                                <select 
                                    className="w-full px-5 py-4 bg-coffee-brown/5 border-transparent rounded-2xl focus:ring-2 focus:ring-accent-gold/20 focus:bg-white transition-all font-bold text-coffee-brown"
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                >
                                    <option value="Indoor">Indoor</option>
                                    <option value="Outdoor">Outdoor</option>
                                    <option value="Balcony">Balcony</option>
                                    <option value="Private Room">Private Room</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-coffee-brown/40 uppercase tracking-widest px-1">Status</label>
                                <div className="flex gap-2">
                                    {['Available', 'Reserved', 'Occupied'].map(s => (
                                        <button 
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({...formData, status: s})}
                                            className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                                                formData.status === s 
                                                ? "bg-coffee-brown text-white border-transparent" 
                                                : "bg-white text-coffee-brown/40 border-coffee-brown/10 hover:border-coffee-brown/30"
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-coffee-brown/5 text-coffee-brown font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-coffee-brown/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-[2] py-4 bg-accent-gold text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all shadow-xl shadow-accent-gold/20"
                                >
                                    {editingTable ? 'Save Changes' : 'Create Table'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTables;
