import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate("/admin");
            else if (user.role === 'staff') navigate("/staff");
            else navigate("/");
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loggedInUser = await login(formData.email, formData.password);
        setLoading(false);
        if (loggedInUser) {
            if (loggedInUser.role === 'admin') {
                navigate("/admin");
            } else if (loggedInUser.role === 'staff') {
                navigate("/staff");
            } else {
                navigate("/");
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-6 py-20 bg-cream relative overflow-hidden animate-fade-in">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-coffee-brown/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-md w-full space-y-12 bg-white/40 backdrop-blur-2xl p-6 lg:p-8 rounded-3xl shadow-2xl shadow-coffee-brown/5 border border-white relative z-10 transform scale-100 hover:scale-[1.01] transition-all duration-700">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-12 bg-coffee-brown rounded-xl mb-4 shadow-2xl shadow-coffee-brown/20 transform rotate-12 group hover:rotate-0 transition-transform duration-700">
                        <Lock className="h-8 w-8 text-accent-gold" strokeWidth={1} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-coffee-brown">LOGIN <br /><span className="text-accent-gold not-">ACCOUNT</span></h2>
                        <p className="text-sm font-bold text-coffee-brown/30 tracking-wide">Welcome back, please login to your account</p>
                    </div>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-coffee-brown/70 ml-1">
                                Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-coffee-brown/20 group-focus-within:text-accent-gold transition-colors" strokeWidth={1.5} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-14 pr-6 py-3 bg-white border border-coffee-brown/5 rounded-full text-coffee-brown text-sm placeholder-coffee-brown/10 focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all shadow-inner"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-coffee-brown/70 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-coffee-brown/20 group-focus-within:text-accent-gold transition-colors" strokeWidth={1.5} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="block w-full pl-14 pr-14 py-3 bg-white border border-coffee-brown/5 rounded-full text-coffee-brown text-sm placeholder-coffee-brown/10 focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all shadow-inner"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-coffee-brown/20 hover:text-accent-gold transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-2">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    className="peer h-5 w-5 appearance-none rounded-lg border-2 border-coffee-brown/10 bg-white checked:bg-coffee-brown checked:border-coffee-brown transition-all cursor-pointer"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                />
                                <CheckCircle2 className="absolute h-3.5 w-3.5 text-accent-gold opacity-0 peer-checked:opacity-100 left-[3px] transition-opacity pointer-events-none" />
                            </div>
                            <span className="text-sm font-bold text-coffee-brown/40 tracking-widest group-hover:text-coffee-brown transition-colors">Remember Me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full h-12 flex justify-center items-center gap-4 bg-coffee-brown text-white rounded-full font-bold text-sm tracking-wide hover:bg-accent-gold focus:outline-none transition-all active:scale-[0.98] shadow-2xl shadow-coffee-brown/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "AUTHENTICATING..." : "LOGIN"}
                        {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-3 transition-transform duration-500" />}
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-sm font-bold text-coffee-brown/30 tracking-wide">
                            New to the store?{" "}
                            <Link to="/register" className="text-accent-gold hover:text-coffee-brown transition-colors underline-offset-8 border-b border-accent-gold/30 hover:border-coffee-brown">
                                CREATE ACCOUNT
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
