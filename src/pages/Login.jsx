import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login Attempt:", formData);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 bg-brand-bg relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-brand-primary/10 border border-white/20 relative z-10 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-700">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-bg rounded-2xl mb-6 shadow-inner">
                        <Lock className="h-8 w-8 text-brand-primary" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-4xl font-black text-brand-primary tracking-tight mb-2">Welcome Back</h2>
                    <p className="text-gray-500 font-medium whitespace-nowrap">Sign in to your account to continue</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
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

                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    className="peer h-5 w-5 appearance-none rounded-lg border-2 border-gray-200 bg-white checked:bg-brand-accent checked:border-brand-accent transition-all cursor-pointer"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                />
                                <CheckCircle2 className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-1 transition-opacity pointer-events-none" />
                            </div>
                            <span className="text-sm text-gray-600 font-medium group-hover:text-brand-primary transition-colors">Remember me</span>
                        </label>

                        <Link to="/forgot-password" size="sm" className="text-sm font-semibold text-brand-accent hover:text-brand-accent/80 transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-brand-primary hover:bg-brand-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all active:scale-[0.98] shadow-lg shadow-brand-primary/20"
                    >
                        Sign in
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-bold text-brand-accent hover:text-brand-accent/80 transition-colors underline-offset-4 hover:underline">
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
