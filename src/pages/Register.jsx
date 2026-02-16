import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate("/admin");
            else navigate("/");
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        fullName: "", // This will be sent as 'name' to the backend
        email: "",
        password: "",
        agreeTerms: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const registeredUser = await register({
            name: formData.fullName,
            email: formData.email,
            password: formData.password
        });
        setLoading(false);
        if (registeredUser) {
            if (registeredUser.role === 'admin') {
                navigate("/admin");
            } else {
                navigate("/");
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 bg-brand-bg relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-brand-primary/10 border border-white/20 relative z-10 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-700">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-bg rounded-2xl mb-6 shadow-inner">
                        <User className="h-8 w-8 text-brand-primary" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-4xl font-black text-brand-primary tracking-tight mb-2">Create Account</h2>
                    <p className="text-gray-500 font-medium whitespace-nowrap">Join our community today</p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-brand-primary mb-1.5 ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-brand-accent transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 focus:bg-white transition-all"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-brand-primary mb-1.5 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-brand-accent transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 focus:bg-white transition-all"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-brand-primary mb-1.5 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-accent transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="block w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 focus:bg-white transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start space-x-2 py-2">
                        <div className="relative flex items-center mt-1">
                            <input
                                type="checkbox"
                                required
                                className="peer h-5 w-5 appearance-none rounded-lg border-2 border-gray-200 bg-white checked:bg-brand-accent checked:border-brand-accent transition-all cursor-pointer"
                                checked={formData.agreeTerms}
                                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                            />
                            <ShieldCheck className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-1 transition-opacity pointer-events-none" />
                        </div>
                        <span className="text-sm text-gray-600 leading-tight">
                            I agree to the <Link className="text-brand-accent font-semibold hover:underline underline-offset-4">Terms of Service</Link> and <Link className="text-brand-accent font-semibold hover:underline underline-offset-4">Privacy Policy</Link>
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-brand-primary hover:bg-brand-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all active:scale-[0.98] shadow-lg shadow-brand-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                        {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link to="/login" className="font-bold text-brand-accent hover:text-brand-accent/80 transition-colors underline-offset-4 hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
