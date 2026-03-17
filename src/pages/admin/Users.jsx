import { useState, useEffect } from "react";
import { Search, Trash2, User as UserIcon, Mail, Calendar, MapPin, ShieldCheck } from "lucide-react";
import api from "../../utils/api";
import DeleteModal from "../../components/admin/DeleteModal";
import toast from "react-hot-toast";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/users");
            if (response.status !== 200 || !response.data?.success) {
                throw new Error(response.data?.message || "Unexpected response while fetching users");
            }
            setUsers(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to fetch users");
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await api.delete(`/users/${selectedUser._id}`);
            if (response.status !== 200) {
                throw new Error(response.data?.message || "Unexpected response while deleting user");
            }
            toast.success("User deleted successfully");
            fetchUsers();
            setIsDeleteOpen(false);
            setSelectedUser(null);
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to delete user");
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-brand-primary tracking-tight">User Management</h1>
                    <p className="text-sm font-medium text-brand-primary/40">Manage your digital community and access control.</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-medium text-brand-primary shadow-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-brand-primary/5 shadow-sm overflow-hidden overflow-x-auto">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-brand-primary/40 font-bold tracking-widest text-xs">Loading Directory...</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-brand-primary/5 border-b border-brand-primary/5">
                                <th className="px-6 py-3 text-sm font-bold tracking-wide text-brand-primary/40">User Identity</th>
                                <th className="px-6 py-3 text-sm font-bold tracking-wide text-brand-primary/40">Contact Info</th>
                                <th className="px-6 py-3 text-sm font-bold tracking-wide text-brand-primary/40">Delivery Address</th>
                                <th className="px-6 py-3 text-sm font-bold tracking-wide text-brand-primary/40">Access Level</th>
                                <th className="px-6 py-3 text-sm font-bold tracking-wide text-brand-primary/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-primary/5">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-brand-primary/5 transition-colors group">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary/40 group-hover:bg-brand-accent group-hover:text-brand-primary transition-all duration-300">
                                                    <UserIcon size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-brand-primary leading-tight tracking-tight">{user.name}</h3>
                                                    <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-brand-primary/30 tracking-widest">
                                                        <Calendar size={10} />
                                                        Joined {new Date(user.createdAt).toLocaleDateString('en-GB')}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2 text-sm font-bold text-brand-primary/60">
                                                <Mail size={14} className="text-brand-primary/20" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="max-w-[200px] space-y-1">
                                                {user.address && (user.address.street || user.address.city) ? (
                                                    <>
                                                        <div className="flex items-start gap-2 text-[11px] font-bold text-brand-primary/60 leading-tight">
                                                            <MapPin size={12} className="text-brand-accent shrink-0 mt-0.5" />
                                                            <span>
                                                                {user.address.street}, {user.address.city}<br />
                                                                {user.address.state}, {user.address.zipCode}<br />
                                                                <span className="">{user.address.country}</span>
                                                            </span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-sm font-bold text-brand-primary/10 tracking-widest">Address not provided</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${user.role === 'admin'
                                                ? "bg-brand-accent/10 border-brand-accent/20 text-brand-primary"
                                                : "bg-brand-primary/5 border-brand-primary/5 text-brand-primary/40"
                                                }`}>
                                                {user.role === 'admin' && <ShieldCheck size={12} />}
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleDeleteClick(user)}
                                                    disabled={user.role === "admin"}
                                                    className={`p-3 rounded-xl transition-all
                                                        ${user.role === "admin"
                                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                            : "bg-brand-bg text-red-500 hover:bg-red-500 hover:text-brand-bg"
                                                        }
                                                    `}
                                                    title={user.role === "admin" ? "Admin users cannot be deleted" : "Delete User"}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <p className="text-brand-primary/20 font-bold tracking-widest text-sm">No users found</p>
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
                itemName={`user "${selectedUser?.name}"`}
            />
        </div>
    );
};

export default AdminUsers;
