import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Outlet } from "react-router-dom";
import router from "./routes/AppRoutes";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { ShopProvider } from "./context/ShopContext";
import { Toaster, toast, resolveValue } from "react-hot-toast";
import { X, CheckCircle, AlertCircle } from "lucide-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
      >
        {(t) => {
          const isError = t.type === 'error';
          const isSuccess = t.type === 'success';

          return (
            <div
              className={`${t.visible ? 'animate-in fade-in zoom-in slide-in-from-right-4' : 'animate-out fade-out zoom-out slide-out-to-right-4'
                } max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden border ${isError ? 'border-red-100 bg-red-50' : isSuccess ? 'border-green-100 bg-green-50' : 'border-brand-primary/5'
                }`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-center">
                  <div className="shrink-0 mt-0.5">
                    {isError ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : isSuccess ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-brand-accent mt-1.5" />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm font-black uppercase tracking-tight ${isError ? 'text-red-600' : isSuccess ? 'text-green-600' : 'text-brand-primary'
                      }`}>
                      {resolveValue(t.message, t)}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`flex border-l ${isError ? 'border-red-100' : isSuccess ? 'border-green-100' : 'border-gray-100'}`}>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className={`w-full border border-transparent rounded-none rounded-r-2xl px-4 flex items-center justify-center transition-all focus:outline-none ${isError
                    ? 'text-red-400 hover:text-red-600 hover:bg-red-100'
                    : isSuccess
                      ? 'text-green-400 hover:text-green-600 hover:bg-green-100'
                      : 'text-gray-400 hover:text-brand-primary hover:bg-gray-50'
                    }`}
                >
                  <X size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          );
        }}
      </Toaster>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
