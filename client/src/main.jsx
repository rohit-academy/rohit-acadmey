import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { DownloadProvider } from "./context/DownloadContext";
import { ProductProvider } from "./context/ProductContext";

import "./styles/theme.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>

      {/* 🔐 User Auth */}
      <AuthProvider>

        {/* 🛒 Shopping Cart */}
        <CartProvider>

          {/* 📥 Purchased Files */}
          <DownloadProvider>

            {/* 📚 Study Materials */}
            <ProductProvider>
              <App />
            </ProductProvider>

          </DownloadProvider>
        </CartProvider>

      </AuthProvider>

    </BrowserRouter>
  </React.StrictMode>
);
