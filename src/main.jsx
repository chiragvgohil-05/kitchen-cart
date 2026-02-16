import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoutes";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import { X } from "lucide-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
      >
        {(t) => (
          <div
            className={`${t.visible ? 'animate-in fade-in zoom-in slide-in-from-right-4' : 'animate-out fade-out zoom-out slide-out-to-right-4'
              } max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden border border-brand-primary/5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-brand-accent mr-3 shrink-0" />
                <p className="text-sm font-black text-brand-primary uppercase tracking-tight">
                  {t.message}
                </p>
              </div>
            </div>
            <div className="flex border-l border-gray-100">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-2xl px-4 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:bg-gray-50 transition-all focus:outline-none"
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </Toaster>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
