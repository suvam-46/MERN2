import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import LoadingScreen from "./pages/LoadingScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/Customer/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import HomePage from "./pages/Customer/HomePage";
import Cart from "./pages/Customer/Cart";
import Profile from "./pages/Customer/Profile";
import Shop from "./pages/Customer/Shop";
import VendorDb from "./pages/Vendor/VendorDb";
import AddProducts from "./pages/Vendor/AddProducts";
import VendorProfile from "./pages/Vendor/VendorProfile";

// Components
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

// --- LAYOUTS ---

/**
 * MainLayout: Handles the standard Customer view with Navbar and Footer.
 */
const MainLayout = ({ cartCount, user }) => {
  return (
    <>
      <Navbar cartCount={cartCount} user={user} />
      <main className="min-h-screen pt-20">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

/**
 * VendorLayout: Handles the Vendor dashboard view. 
 * Includes basic protection to ensure only vendors can access these routes.
 */
const VendorLayout = ({ user }) => {
  if (user && user.role !== "vendor") {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="bg-[#F0F7FF] min-h-screen">
      <Outlet />
    </div>
  );
};

// --- MAIN APP COMPONENT ---

function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // 1. Session & Initialization Logic
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Smooth transition from LoadingScreen to App
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // 2. Cart Logic
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const isItemInCart = prev.find((item) => item.id === product.id);
      if (isItemInCart) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const cartCount = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  return (
    <BrowserRouter>
      {/* CRITICAL: isAppLoading check is INSIDE BrowserRouter.
          This allows LoadingScreen.jsx to use hooks like useNavigate() or useLocation() 
          without throwing "context" errors.
      */}
      {isAppLoading ? (
        <LoadingScreen />
      ) : (
        <>
          {/* Global Toast Notifications */}
          <Toaster position="top-center" reverseOrder={false} />
          
          <Routes>
            {/* --- CUSTOMER / PUBLIC ROUTES --- */}
            <Route element={<MainLayout cartCount={cartCount} user={user} />}>
              {/* index route makes "/" the HomePage */}
              <Route index element={<HomePage onAddToCart={handleAddToCart} />} />
              <Route path="/homepage" element={<HomePage onAddToCart={handleAddToCart} />} />
              
              <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} />} />
              <Route path="/shop/:category" element={<Shop onAddToCart={handleAddToCart} />} />
              <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
              
              {/* FIXED: Pass 'setUser' to Profile so the logout button 
                  can update the global state.
              */}
              <Route 
                path="/profile" 
                element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} 
              />
            </Route>

            {/* --- AUTH ROUTES --- */}
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />

            {/* --- VENDOR ROUTES --- */}
            <Route path="/vendor" element={<VendorLayout user={user} />}>
              <Route index element={<Navigate to="/vendor/dashboard" />} />
              <Route path="dashboard" element={<VendorDb />} />
              <Route path="add-product" element={<AddProducts />} />
              <Route path="settings" element={<VendorProfile />} />
            </Route>

            {/* FALLBACK: Redirect any unknown URL to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;