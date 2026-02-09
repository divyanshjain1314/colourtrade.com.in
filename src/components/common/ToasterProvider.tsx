"use client";
import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
                duration: Infinity,
                style: {
                    background: "#0D1520",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    backdropFilter: "blur(10px)",
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "16px 24px",
                },
                success: {
                    iconTheme: { primary: "#00E676", secondary: "#000" },
                    style: { border: "1px solid rgba(0, 230, 118, 0.3)", boxShadow: "0 0 20px rgba(0, 230, 118, 0.1)" },
                },
                error: {
                    iconTheme: { primary: "#FF3B3B", secondary: "#000" },
                    style: { border: "1px solid rgba(255, 59, 59, 0.3)", boxShadow: "0 0 20px rgba(255, 59, 59, 0.1)" },
                },
            }}
        />
    );
};

export default ToasterProvider;